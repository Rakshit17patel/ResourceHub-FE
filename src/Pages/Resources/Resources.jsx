import React, { useEffect, useState } from 'react'

import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import { Grid, Paper, Typography } from '@mui/material';

import data from "./test.json"

const Resources = ()=> {
  // const [data, setData] = useState([]);

  // // ApiLink
  // useEffect(() => {
  //   fetch('http://127.0.0.1:8000/resources')
  //     .then(response => response.json())
  //     .then(json => setData(json))
  //     .catch(error => console.error(error));
  // }, []);

  const columns = [
    { field: 'ResourceID', headerName: 'ID', width: 90 },
    { field: 'Name', headerName: 'Name', width: 150 },
    { field: 'Rate', headerName: 'Rate', width: 130 },
    {
      field: 'Skills',
      headerName: 'Skills',
      width: 300,
      renderCell: (params) => (
        <div>
          {Object.entries(params.value).map(([skill, { level }]) => (
            <div key={skill}>
              {skill}: {level}
            </div>
          ))}
        </div>
      )
    },
    {
      field: 'PastJobTitles',
      headerName: 'Past Job Titles',
      width: 300,
      renderCell: (params) => (
        <div>
          {Object.entries(params.value).map(([title, { years }]) => (
            <div key={title}>
              {title}: {years} years
            </div>
          ))}
        </div>
      )
    },
    {
      field: 'Domain',
      headerName: 'Domain',
      width: 200,
      renderCell: (params) => (
        <div>
          {params.value.join(', ')}
        </div>
      )
    },
    { field: 'AvailableDate', headerName: 'Available Date', width: 150 },
    { field: 'OrgID', headerName: 'Org ID', width: 100 },
  ];

  const rows = data.map((project, index) => ({
    id: index,
    ...project,
  }));

  const addRow = () => {
    console.log("New Resource Added")
  }

  return (
    <Paper style={{ padding: 16, marginTop: 16 }}>
      <Typography variant="h6" gutterBottom>
        Resource Data
      </Typography>
      <Grid container >
        <Button size="small" variant="contained" onClick={addRow} sx={{ marginBottom: '10px' }}>
          Add New Resource
        </Button>
        <Grid item xs={12}>
          <div style={{ height: '100%', width: '100%' }}>
            <DataGrid rows={rows} columns={columns} pageSize={'auto'}
              slotProps={{
                loadingOverlay: {
                  variant: 'skeleton',
                  noRowsVariant: 'skeleton',
                },
              }} />
          </div>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default Resources;
