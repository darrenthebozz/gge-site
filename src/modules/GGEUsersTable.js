import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import UserSettings from './userSettings'
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ErrorType, GetErrorTypeName, ActionType, GetActionTypeName, LogLevel } from "../types.js"

export default function GGEUserTable(props) {
    const [selected, setSelected] = React.useState([]);
    const [openSettings, setOpenSettings] = React.useState(false);
    const [openLogs, setOpenLogs] = React.useState(false);
    let dummyUser = {}
    const [selectedUser, setSelectedUser] = React.useState(dummyUser)
    const [currentLogs, setCurrentLogs] = React.useState([])
    const handleSettingsClose = () => {
        setOpenSettings(false);
        setSelectedUser(dummyUser)
    };
    const handleSettingsOpen = () => {
        setOpenSettings(true);
    };
    const handleLogClose = () => {
        setOpenLogs(false);
    };
    const handleLogOpen = () => {
        setCurrentLogs([])
        props.ws.addEventListener("message", (msg) => {
            let [err, action, obj] = JSON.parse(msg.data.toString())
            
            if (Number(action) != ActionType.GetLogs)
                return
            
            if(Number(err) != ErrorType.Success)
                return 
            setCurrentLogs(obj[0].splice(obj[1], obj[0].length - 1).concat(obj[0]).map((obj, index)=> 
                 <div key={index} style={{ color : obj[0] == LogLevel.Error ? "red" : 
                                              obj[0] == LogLevel.Warn ? "yellow" : "blue"}}>{obj[1]}</div>
            ))
        });
        setOpenLogs(true);
    }
    const { onSelectAllClick, numSelected, rowCount } = props;

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = props.rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };
    function Log() {
        return (<Paper sx={{maxHeight: '90%', overflow: 'auto', height:'80%', width:'40%' }}>
            <div onClick={(event) => {event.stopPropagation()}} style={{width:"100%", height:"100%"}}>
            <Typography variant="subtitle1" component="div" align='left' padding={"10px"}>
                {currentLogs}
            </Typography>
            </div>
            </Paper>)
    }
    return (
        <>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openSettings}
                onClick={handleSettingsClose}
                style={{ maxHeight: '100%', overflow: 'auto' }} >
                <UserSettings ws={props.ws} 
                              selectedUser={selectedUser}
                              key={selectedUser.id}
                              closeBackdrop={handleSettingsClose} 
                              plugins={props.plugins}/>
            </Backdrop>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openLogs}
                onClick={handleLogClose}
                style={{ maxHeight: '100%', overflow: 'auto' }} >
                <Log />
            </Backdrop>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    indeterminate={numSelected > 0 && numSelected < rowCount}
                                    checked={props.rows.length == selected.length}
                                    onChange={onSelectAllClick}
                                    onClick={handleSelectAllClick}
                                    inputProps={{
                                        'aria-label': 'select all entries',
                                    }}
                                />
                            </TableCell>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left" padding='none'>Plugins</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align='right' padding='none'>
                                <Button variant="contained" style={{ maxWidth: '64px', maxHeight: '32px', minWidth: '32px', minHeight: '32px', marginRight: "10px" }} onClick={handleSettingsOpen}>+</Button>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.rows.map((row, index) => { // add "selected" here
                            function PlayerRow() {
                                let getEnabledPlugins = () => {
                                    let enabledPlugins = []
                                    Object.entries(row.plugins).forEach(([key, value]) => {
                                        if(value.state == true && value.forced != true)
                                            enabledPlugins.push(key)
                                        return
                                    } )
                                    return enabledPlugins   
                                }

                                const isItemSelected = selected.includes(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;
                                const [state, setState] = React.useState(row.state)
                                row.state = state
                                
                                let status = props.usersStatus[row.id]
                                status ??= {}
                                return (<TableRow style={ status?.hasError ? {border:"red solid 2px"} : {}}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={isItemSelected}
                                            onClick={(event) => {
                                                let index = selected.indexOf(row.id)
                                                if (index < 0) {
                                                    selected.push(row.id)
                                                    setSelected(Array.from(selected))
                                                    return;
                                                }
                                                setSelected(selected.toSpliced(index, 1));
                                            }}
                                            inputProps={{
                                                'aria-labelledby': labelId,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row">{row.name}</TableCell>
                                    
                                    <TableCell align="left" padding='none'>{getEnabledPlugins().join(" ")}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex' }}>
                                            <Box sx={{ display: 'flex',flexDirection:"column" }} paddingRight={"10px"}>
                                                <Typography>Aqua</Typography>
                                                <Typography>{status.aquamarine ??= "NaN"}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex',flexDirection:"column" }} paddingRight={"10px"}>
                                                <Typography>Mead</Typography>
                                                <Typography>{status.mead ??= "NaN"}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex',flexDirection:"column" }} paddingRight={"10px"}>
                                                <Typography>Food</Typography>
                                                <Typography>{status.food ??= "NaN"}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex',flexDirection:"column" }} paddingRight={"10px"}>
                                                <Typography>Coin</Typography>
                                                <Typography>{status.coin ??= "NaN"}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right" padding='none' style={{ padding: "10px" }}>
                                        <Button variant="text" onClick={() => {
                                            props.ws.send(JSON.stringify([ErrorType.Success, ActionType.GetLogs, row]))
                                            handleLogOpen()
                                        }}>LOGS</Button>
                                        <Button variant="text" onClick={() => {
                                            setSelectedUser(row)
                                            setOpenSettings(true);
                                        }}>Settings</Button>
                                        <Button variant="contained"
                                            onClick={() => {
                                                row.state = !state
                                                props.ws.send(JSON.stringify([ErrorType.Success, ActionType.SetUser, row]))
                                                setState(!state)
                                            }}
                                            style={{ maxWidth: '64px', maxHeight: '32px', minWidth: '32px', minHeight: '32px', marginLeft: "10px" }}>{state ? "Stop" : "Start"}</Button>
                                    </TableCell>
                                </TableRow>)
                            }
                            return <PlayerRow key={row.id} />
                        })}
                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align='right' padding='none' />
                            <TableCell align='right' padding='none' />
                            <TableCell align='right' padding='none' />
                            <TableCell align='right' padding='none' />
                            <TableCell align='right' padding='none'>
                                <Button variant="contained" style={{ maxWidth: '64px', maxHeight: '32px', minWidth: '32px', minHeight: '32px', paddingLeft: "38px", paddingRight: "38px", margin: "10px" }} onClick={() => {
                                    props.ws.send(JSON.stringify([ErrorType.Success, ActionType.RemoveUser, props.rows.filter((e) => selected.includes(e.id)) ]))
                                }}>Remove</Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}