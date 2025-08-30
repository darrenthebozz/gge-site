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
import { TableVirtuoso } from 'react-virtuoso';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
function CreatePlugin(props) {
    const [open, setOpen] = React.useState(false);
    const [state, setState] = React.useState(props.state);
    return (
        <React.Fragment key={props.name}>
            <TableRow>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{props.name}</TableCell>
                <TableCell>{props.description}</TableCell>
                <TableCell>
                    <Button variant="contained" style={{ maxWidth: '64px', maxHeight: '32px', minWidth: '32px', minHeight: '32px', marginLeft: "10px" }} onClick={() => {
                        setState(!state)
                        props.toggleState()
                    }}>{state ? "Stop" : "Start"}</Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4} >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <FormGroup>
                            {props.pluginOptions?.map((obj) => {
                                props.pluginsState.find(obj => obj.key == obj)
                                if (obj.type == "Checkbox") {
                                    return <FormControlLabel control={<Checkbox />} label={obj.label} key={ obj.label}/>
                                }
                                else if(obj.type == "Slider") {
                                    function NewSlider() {
                                        const [value, setValue] = React.useState(obj.value ??= 0);
                                        return <Box sx={{display:"flex", whiteSpace:"nowrap", justifyContent:"center", padding:"1px", textAlign:"center"}}>
                                            <Typography alignSelf={"center"} id="input-slider">
                                                {obj.label}
                                            </Typography>
                                            <Slider  style={{marginLeft:"20px", marginRight:"10px"}} aria-label={obj.label} value={value} onChange={(event, newValue) => setValue(newValue)} />
                                        </Box>
                                    }
                                    return <NewSlider key={ obj.label }/>
                                }
                            })}
                        </FormGroup>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}


const columns = [
    {
        width: 8,
        label: '',
        dataKey: 'icon',
    },
    {
        width: 100,
        label: 'Name',
        dataKey: 'name',
    },
    {
        width: 100,
        label: 'Description',
        dataKey: 'description',
    },
    {
        width: 50,
        label: '',
        dataKey: 'state',
        numeric: true,
    }
];

function rowContent(_index, row) {
    return (
        <>
            {row}
        </>
    );
}

function fixedHeaderContent() {
    return (
        <TableRow>
            {columns.map((column) => (
                <TableCell
                    key={column.dataKey}
                    variant="head"
                    align={column.numeric || false ? 'right' : 'left'}
                    style={{ width: column.width }}
                    sx={{ backgroundColor: 'background.paper' }}
                >
                    {column.label}
                </TableCell>
            ))}
        </TableRow>
    );
}

export default function PluginTable(props) {

    const rows = props.plugins?.map(obj => {
        let [pluginState, setPluginState] = React.useState(props.userPlugins.find(p => p[obj.key]))
        return <CreatePlugin name={obj.name} description={obj.description} pluginOptions={obj.pluginOptions} pluginOptionsState={pluginState} pluginOptionsStateChange={(e) =>{
            setPluginState(e)
        }}/>
    })
    
    const VirtuosoTableComponents = {
        Scroller: React.forwardRef((props, ref) => (
            <TableContainer component={Paper} {...props} ref={ref} />
        )),
        Table: (props) => (
            <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
        ),
        TableHead: React.forwardRef((props, ref) => <TableHead {...props} ref={ref} />),
        TableRow: () => {
            return (<>{rows}</>)

        },
        TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
    };
    return (
        <Paper style={{ height: 400, width: '100%' }}>
            <TableVirtuoso
                data={rows}
                components={VirtuosoTableComponents}
                fixedHeaderContent={fixedHeaderContent}
                itemContent={rowContent}
            />
        </Paper>
    );
}