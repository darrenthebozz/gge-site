
import './App.css';
import GGEUserTable from './modules/GGEUsersTable'; 
import ResponsiveDrawer from './modules/drawer'; 
import { ThemeProvider, createTheme } from '@mui/material/styles';
import * as React from 'react';
import { ErrorType, GetErrorTypeName, ActionType, GetActionTypeName, User } from "./types.js"
import ReconnectingWebSocket from "reconnecting-websocket"
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
const __DEV__ = false

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
function App() {
  let [users, setUsers] = React.useState([])
  let [usersStatus, setUsersStatus] = React.useState({})
  let [plugins, setPlugins] = React.useState([])
  let ws = React.useMemo(() => {
    let usersInternal = []
    const ws = new ReconnectingWebSocket(`${window.location.protocol === 'https:' ? "wss" : "ws"}://${window.location.hostname}:8882`,[], {WebSocket: WebSocket, minReconnectionDelay: 3000 })
    
    //const ws = new ReconnectingWebSocket(__DEV__ ? "ws://127.0.0.1:8882" : "wss://ashportal.ddns.net:8882",[], {WebSocket: WebSocket, minReconnectionDelay: 3000 })
    //ashportal.ddns.net
//    const ws = new ReconnectingWebSocket(`wss://${window.location.hostname}:8882`,[], {WebSocket: WebSocket, minReconnectionDelay: 3000 })
    // const ws = new ReconnectingWebSocket(`ws://${"127.0.0.1"}:8882`,[], {WebSocket: WebSocket, minReconnectionDelay: 3000 })
    
    ws.addEventListener("open", () => {
      ws.send(JSON.stringify([ErrorType.Success, ActionType.GetUUID, getCookie("uuid")]))
    })

    ws.addEventListener("message", (msg) => {
      let [err, action, obj] = JSON.parse(msg.data.toString())
      if(err)
        console.error(GetErrorTypeName(err))

  
      switch (Number(action)) {
        case ActionType.GetUUID:
          if(err == ErrorType.Unauthenticated)
            return window.location.href = "signin.html";
          
          ws.send(JSON.stringify([ErrorType.Success, ActionType.GetUsers, undefined]))
          break;
        case ActionType.GetUsers:
          if(err != ErrorType.Success)
            return
          setUsers(usersInternal = obj[0].map(e=> new User(e)))
          setPlugins(obj[1])
          break;
        case ActionType.StatusUser: 
          usersStatus[obj.id] = structuredClone(obj)
          setUsersStatus(structuredClone(usersStatus))
          break;
        default:
          return
      }
    })
    return ws
  }, [])
  
  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        {/* <ResponsiveDrawer> */}
          <GGEUserTable ws={ws} plugins={plugins} rows={users} usersStatus={usersStatus} />
        {/* </ResponsiveDrawer> */}
      </ThemeProvider>
    </div>
  );
}

export default App;
