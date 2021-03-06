class Referee {

  play(source1, source2) {
    source1 = source1.toString();
    source2 = source2.toString();

    let promises = [
      this.runWorker(source1, source2, 1000),
      this.runWorker(source2, source1, 1000),
    ];

    return Promise.all(promises);
  }

  runWorker(mySource, otherSource, timeout) {
    let worker = this.spawnWorker(),
        startTime,
        finishTime,
        choice;

    worker.postMessage({mySource, otherSource, timeout});
    worker.onmessage = e => {
      let {state, output} = e.data;
      if (state === 'started') {
        startTime = new Date();
      }
      else if (state === 'errored') {
        console.error('Worker failed...');
      }
      else if (state === 'finished') {
        finishTime = new Date();
        choice = output;
      }
    };

    let simulate = new Promise(resolve => {
      let intervalID = setInterval(() => {
        let now = new Date();
        if (now - startTime > timeout)
          finishTime = now;

        if (finishTime) {
          clearInterval(intervalID);
          worker.terminate();

          resolve({
            choice: choice || 'terminated',
            time: finishTime - startTime,
          });
        }
      }, 100);
    });

    return simulate.then(choices => {
      console.log(JSON.stringify(choices, null, '\t'));
      return choices;
    });
  }

  spawnWorker() {
    let workerCode = this.worker.toString().split('\n').slice(1, -1).join('\n'),
        blob = new Blob([workerCode], {type: 'application/javascript'}),
        worker = new Worker(URL.createObjectURL(blob));

    return worker;
  }

  worker() {
    onmessage = e => {
      let {mySource, otherSource, timeout} = e.data;
      postMessage({state: 'started'});
      let choice = eval(mySource)(mySource, otherSource, timeout);
      postMessage({state: 'finished', output: choice});
    };
  }

}
