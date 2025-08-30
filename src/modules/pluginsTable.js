import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';

import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

export default function PluginsTable(props) {
    let userPlugins = props.userPlugins 
    userPlugins ??= {}
    let Plugin = (props2) => {
        userPlugins[props2.data.key] ??= {}
        const [open, setOpen] = React.useState(false);
        const [state, setState] = React.useState(userPlugins[props2.data.key]?.state)
        return (
            <>
            <TableRow>
                <TableCell>
                    {
                        props2.data?.pluginOptions ? (
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                        ) : undefined
                    }
                </TableCell>
                <TableCell>{props2.data.name}</TableCell>
                <TableCell>{props2.data.description}</TableCell>
                <TableCell align='right'>
                { !props2.data.force ? 
                <Button variant="contained" style={{ maxWidth: '64px', maxHeight: '32px', minWidth: '32px', minHeight: '32px', marginLeft: "10px" }} onClick={() => {
                            setState(!state)
                            userPlugins[props2.data.key].state = !state
                            props.onChange(userPlugins)
                        }}>{state ? "Stop" : "Start"}</Button> : ""
                    }
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4} >
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <FormGroup>
                                {props2.data?.pluginOptions?.map((obj) => {
                                    let PluginOption = () => {
                                        userPlugins[props2.data.key][obj.key] ??= obj.default ??= 0
                                        const [value, setValue] = React.useState(userPlugins[props2.data.key][obj.key])

                                        let onChange = (newValue) => {
                                            console.log(newValue)
                                            userPlugins[props2.data.key][obj.key] = newValue
                                            setValue(newValue)
                                            props.onChange(userPlugins)
                                        }
                                        if(obj.type == "Text") {
                                            //<TextField required label="Username" value={name} onChange={e => setName(e.target.value)} disabled={!isNewUser} />
                                            return <TextField label={obj.label} key={obj.label} value={value}   onChange={(e) => onChange(e.target.value)} />
                                        
                                            // return <TextField required label={obj.label} value={value} key={obj.label} onChange={(_, newValue) => onChange(newValue)} />
                                        }
                                        if (obj.type == "Checkbox") {
                                            return <FormControlLabel control={<Checkbox /> } label={obj.label} key={obj.label} checked={value} onChange={(_, newValue) => onChange(newValue)} />
                                        }
                                        else if (obj.type == "Slider") {
                                            return <Box sx={{ display: "flex", whiteSpace: "nowrap", justifyContent: "center", padding: "1px", textAlign: "center" }}>
                                                <Typography alignSelf={"center"} id="input-slider">
                                                    {obj.label}
                                                </Typography>
                                                <Slider style={{ marginLeft: "20px", marginRight: "10px" }} aria-label="Default" key={obj.label} value={value} onChange={(_, newValue) => onChange(newValue)} />
                                                <Typography alignSelf={"center"} id="input-slider">
                                                    {`${value}%`}
                                                </Typography>
                                            </Box>
                                        }
                                        
                                        return <Typography>{"Failed to load option"}</Typography>
                                    }
                                    return <PluginOption key={obj.key} />
                                })}
                            </FormGroup>
                        </Collapse>
                    </TableCell>
                </TableRow></>
        )
    }
    return (
        <Paper style={{ minHeight: 400, maxHeight: 350, width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 400 }}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align='right'/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.plugins.map((plugin) => <Plugin data={plugin} key={plugin.key}/>)}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}