import React, {useEffect,useState} from 'react'

import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import { Grid, Paper, Typography } from '@mui/material';

import data from "./test.json"

const Projects=()=>{
  // const [data, setData] = useState([]);

  // // ApiLink
  // useEffect(() => {
  //   fetch('http://127.0.0.1:8000/projects')
  //     .then(response => response.json())
  //     .then(json => setData(json))
  //     .catch(error => console.error(error));
  // }, []);

  const columns = [
    { field: 'ProjectID', headerName: 'Project ID', width: 50 },
    { field: 'ProjectName', headerName: 'Project Name', width: 300 },
    { field: 'OrgID', headerName: 'Org ID', width: 75 },
    { field: 'NumberOfDays', headerName: '# Of Days', width: 75 },
    { field: 'ProjectStartDate', headerName: 'Project Start Date', width: 150 },
    { field: 'Technology', headerName: 'Technology', width: 250 },
    { field: 'Domain', headerName: 'Domain', width: 200 },
    { field: 'Resources', headerName: 'Resources' }
  ];

  const rows = data.map((project, index) => ({
    id: index,
    ...project,
  }));

  const addRow = () =>{
    console.log("New Project Added")
  }

  return(
    <Paper style={{ padding: 16, marginTop: 16 }}>
      <Typography variant="h6" gutterBottom>
        Project Data
      </Typography>
      <Grid container >
        <Button size="small" variant="contained" onClick={addRow} sx={{ marginBottom: '10px'}}>
          Add New Project
        </Button>
        <Grid item xs={12}>
          <div style={{ height: '100%', width: '100%' }}>
            <DataGrid rows={rows} columns={columns} pageSize={'auto'} 
              slotProps={{
                loadingOverlay: {
                  variant: 'skeleton',
                  noRowsVariant: 'skeleton',
                },
              }}
            />
          </div>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default Projects;