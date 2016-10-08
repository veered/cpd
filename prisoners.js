Prisoners = {

  cooperateBot: (mySource, otherSource, timeout) => {
    return 'cooperate';
  },

  defectBot: (mySource, otherSource, timeout) => {
    return 'defect';
  },

  randomBot: (mySource, otherSource, timeout) => {
    return Math.random() < .5
      ? 'cooperate'
      : 'defect'
    ;
  },

  cliqueBot: (mySource, otherSource, timeout) => {
    return mySource === otherSource
      ? 'cooperate'
      : 'defect'
    ;
  },

  mirrorBot: (mySource, otherSource, timeout) => {
    return eval(otherSource)(otherSource, mySource, timeout);
  },

  mimicBot: (mySource, otherSource, timeout) => {
    return Math.random() > .01
      ? eval(otherSource)(otherSource, mySource, timeout)
      : 'cooperate'
    ;
  },

  bossBot: (mySource, otherSource, timeout) => {
    if (timeout < 10)
      return 'cooperate';
    return eval(otherSource)(otherSource, mySource, timeout * .9);
  },

};
