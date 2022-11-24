enum LOG_LEVEL {
  Normal = 0,
  Error,
}
let __log_level = LOG_LEVEL.Normal;

function setLogLevel(logLevel: LOG_LEVEL) {
  console.log("setLogLevel:", logLevel);
  __log_level = logLevel;
}

function normal(...msg: any[]) {
  if (__log_level <= LOG_LEVEL.Normal) {
    console.log(...msg);
  }
}

function error(...msg: any[]) {
  if (__log_level <= LOG_LEVEL.Error) {
    console.log(...msg);
  }
}

type l_log = {
  setLogLevel: (arg0: LOG_LEVEL) => void;
  normal: (...arg0: any[]) => void;
  error: (...arg0: any[]) => void;
};

let log: l_log = {
  normal,
  error,
  setLogLevel,
};

export default log;
