const ActionType = Object.freeze({
    GetUUID: 0,
    GetUsers: 1,
    SetUser: 2,
    RemoveUser: 3,
    AddUser: 4,
    GetLogs: 5,
    Reset: 6,
    StatusUser: 7,
    Unknown: 8,
});
let GetActionTypeName = (id) => {
    let ret = Object.keys(ActionType).find(key => ActionType[key] == id)
    ret ??= ActionType.Unknown
    return ret
}
const ErrorType = Object.freeze({
    Success: 0,
    UnknownAction: 1,
    Unauthenticated: 2,
    Authentication: 3,
    Generic: 4,
    UnknownError: 5,
});

let GetErrorTypeName = (id) => {
    let ret = Object.keys(ErrorType).find(key => ErrorType[key] == id)
    return ret ??= "UnknownError"
}
const LogLevel = Object.freeze({
    Info: 0,
    Warn: 1,
    Error: 2
});


class User {
    constructor(obj) {
      this.id = Number(obj.id) 
      this.state = Number(obj.state)
      this.name = String(obj.name) 
      this.pass = String(obj.pass ? obj.pass : "")
      this.plugins = obj.plugins
      this.temporary = Boolean(obj?.temporary)
      this.lt = Number(obj.lt)
    }
  }
export { ActionType, GetActionTypeName, ErrorType, GetErrorTypeName, LogLevel, User }
