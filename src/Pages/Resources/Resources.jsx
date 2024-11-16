import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { DataGrid } from '@mui/x-data-grid';
import { Grid, Paper, Typography, Popover, List, ListItem, ListItemText } from '@mui/material';


const Resources = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // State to hold the search query
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverContent, setPopoverContent] = useState([]);
  const [contentType, setContentType] = useState('');
  const [availableDateFilter, setAvailableDateFilter] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/Resources');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePopoverOpen = (event, content, type) => {
    setAnchorEl(event.currentTarget);
    setPopoverContent(content);
    setContentType(type); // Set the type of content to display (Skills or Past Job Titles)
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const columns = [
    { field: 'ResourceID', headerName: 'ID', width: 90 },
    { field: 'Name', headerName: 'Name', width: 150 },
    { field: 'Rate', headerName: 'Rate', width: 130 },
    {
      field: 'Domain',
      headerName: 'Domain',
      width: 200,
      renderCell: (params) => (
        <div>{params.value.join(', ')}</div>
      ),
    },
    { field: 'AvailableDate', headerName: 'Available Date', width: 150 },
    {
      field: 'Details',
      headerName: 'Details',
      width: 240,
      renderCell: (params) => (
        <div>
          <Button
            size="small"
            variant="contained"
            onClick={(event) => handlePopoverOpen(event, params.row.Skills, 'Skills')}
            style={{ marginRight: '8px' }}
          >
            Skills
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={(event) => handlePopoverOpen(event, params.row.PastJobTitles, 'Past Job Titles')}
          >
            Past Job Titles
          </Button>
        </div>
      ),
    }
  ];

// Helper function to extract all searchable data from a row
const flattenRowData = (row) => {
  let flatData = '';

  // Include top-level fields
  flatData += Object.values(row)
    .filter((value) => typeof value === 'string' || typeof value === 'number')
    .join(' ')
    .toLowerCase();

  // Include Skills
  if (row.Skills) {
    flatData +=
      ' ' +
      Object.entries(row.Skills)
        .map(([skill, details]) => `${skill} ${details.level}`)
        .join(' ')
        .toLowerCase();
  }

  // Include Past Job Titles
  if (row.PastJobTitles) {
    flatData +=
      ' ' +
      Object.entries(row.PastJobTitles)
        .map(([title, details]) => `${title} ${details.years}`)
        .join(' ')
        .toLowerCase();
  }

  // Include Domain
  if (row.Domain && Array.isArray(row.Domain)) {
    flatData += ' ' + row.Domain.join(' ').toLowerCase();
  }

  return flatData;
};

// Filtered rows based on the search query and date filter
const filteredRows = data
  .filter((row) => {
    const rowData = flattenRowData(row);
    const matchesSearch = searchQuery
      .toLowerCase()
      .split(' ')
      .every((word) => rowData.includes(word));

    let matchesDate = true;
    if (availableDateFilter) {
      matchesDate = row.AvailableDate >= availableDateFilter;
    }

    return matchesSearch && matchesDate;
  })
  .map((project, index) => ({
    id: index,
    ...project,
  }));

  const addRow = () => {
    console.log('New Resource Added');
  };

  return (
    <Paper style={{ padding: 16, marginTop: 16 }}>
      <Typography variant="h6" gutterBottom>
        Resource Data
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={4}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, domain, skills, etc."
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Available Date From"
            type="date"
            variant="outlined"
            fullWidth
            value={availableDateFilter}
            onChange={(e) => setAvailableDateFilter(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={4} style={{ textAlign: 'right' }}>
          <Button
            size="small"
            variant="contained"
            onClick={addRow}
            sx={{ marginBottom: '10px' }}
          >
            Add New Resource
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} style={{ marginTop: '16px' }}>
        <div style={{ height: '100%', width: '100%' }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSize={'auto'}
            loading={loading}
            slotProps={{
              loadingOverlay: {
                variant: 'skeleton',
                noRowsVariant: 'skeleton',
              },
            }}
          />
        </div>
      </Grid>

      {/* Popover for More Details */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Paper style={{ padding: '16px', maxWidth: '300px' }}>
          <List dense>
            {contentType === 'Skills' &&
              popoverContent &&
              Object.entries(popoverContent).map(([skill, { level }]) => (
                <ListItem key={skill} disableGutters>
                  <ListItemText
                    primary={<strong>{skill}</strong>}
                    secondary={`Level: ${level}`}
                    primaryTypographyProps={{ variant: 'subtitle1' }}
                    secondaryTypographyProps={{ color: 'textSecondary' }}
                  />
                </ListItem>
              ))}
            {contentType === 'Past Job Titles' &&
              popoverContent &&
              Object.entries(popoverContent).map(([title, { years }]) => (
                <ListItem key={title} disableGutters>
                  <ListItemText
                    primary={<strong>{title}</strong>}
                    secondary={`Experience: ${years} years`}
                    primaryTypographyProps={{ variant: 'subtitle1' }}
                    secondaryTypographyProps={{ color: 'textSecondary' }}
                  />
                </ListItem>
              ))}
          </List>
        </Paper>
      </Popover>
    </Paper>
  );
};



export default Resources;
