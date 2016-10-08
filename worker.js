onmessage = e => {
  let {mySource, otherSource, timeout} = e.data;
  postMessage({state: 'started'});
  let choice = eval(mySource)(mySource, otherSource, timeout);
  postMessage({state: 'finished', output: choice});
};
