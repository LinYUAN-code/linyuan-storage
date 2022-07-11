

enum LOG_LEVEL{
    Normal = 0,
    Error,
}
let __log_level = LOG_LEVEL.Normal;

function setLogLevel(logLevel: LOG_LEVEL) {
    __log_level = logLevel;
}


function normal(...msg) {
    if(__log_level >= LOG_LEVEL.Normal) {
        console.log(...msg);
    }
}

function error(...msg) {
    if(__log_level >= LOG_LEVEL.Error) {
        console.log(...msg);
    }
}

type l_log = {
    setLogLevel: (LOG_LEVEL) => void,
    normal: (...any) => void,
    error: (...any) => void,
}

let log: l_log = {
    normal,
    error,
    setLogLevel
};

export default log;

