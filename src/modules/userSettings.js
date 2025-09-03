import * as React from 'react';
import PluginsTable from './pluginsTable'

import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ErrorType, GetErrorTypeName, ActionType, GetActionTypeName } from "../types.js"

export default function UserSettings(props) {
    props.selectedUser.name ??= ""
    const isNewUser = props.selectedUser.name == ""
    const [name, setName] = React.useState(props.selectedUser.name)
    const [pass, setPass] = React.useState("")
    const [plugins, setPlugins] = React.useState(props.selectedUser.plugins)
    const [externalEvent, setExternalEvent] = React.useState(props.selectedUser.externalEvent)
    return (
        <div onClick={(event) => event.stopPropagation()}>
            <Paper>
                <div style={{color:"red", border:"red 2px solid"}}>
                    <b>Warning</b>
                    <br></br>
                    <div style={{color:"white"}}>
                    Using this software may violate the terms of service of the game or platform you are using. <br></br>Using this software could result in a permanent account ban, loss of in-game progress, and/or other penalties. <br></br> Proceed at your own risk
                    </div>
                </div>
                
                <FormGroup row={true} style={{ padding: "12px" }}>
                    <TextField required label="Username" value={name} onChange={e => setName(e.target.value)} disabled={!isNewUser} />
                    <TextField required label="Password" type='password' value={pass} onChange={e => setPass(e.target.value)} />
                    <FormControlLabel style={{ margin: "auto", marginRight:"2px" }} control={<Checkbox/>} checked={externalEvent} onChange={e => setExternalEvent(e.target.checked)} label="OR/BTH" />

                    <PluginsTable plugins={props.plugins} userPlugins={plugins} 
                    onChange={ e => setPlugins(e)}/>
                    <Button variant="contained" style={{ margin: "10px", maxWidth: '64px', maxHeight: '32px', minWidth: '32px', minHeight: '32px' }}
                        onClick={async () => {
                            try {
                                props.selectedUser.name = name
                                props.selectedUser.plugins = plugins
                                props.selectedUser.externalEvent = externalEvent
                                if(pass)
                                props.selectedUser.pass = pass
                                else if(isNewUser)
                                    return

                                props.ws.send(JSON.stringify([ErrorType.Success, isNewUser ? ActionType.AddUser : ActionType.SetUser, props.selectedUser]))
                                props.closeBackdrop()
                            }
                            catch (e) {
                                console.warn(e)
                            }
                        }}
                    >
                        Save
                    </Button>
                </FormGroup>
            </Paper>
        </div>
    );
}