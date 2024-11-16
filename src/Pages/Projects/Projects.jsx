// src/components/Projects.js

import React, { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { DataGrid } from "@mui/x-data-grid";
import {
  Grid,
  Paper,
  Typography,
  Popover,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";

const Projects = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // State to hold the search query
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverContent, setPopoverContent] = useState([]);
  const [contentType, setContentType] = useState("");
  const [availableDateFilter, setAvailableDateFilter] = useState(""); // New Date Filter State

  const isSmallScreen = useMediaQuery("(max-width:768px)");

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/Projects");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
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
    setContentType(type); // Set the type of content to display (RequiredResources)
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const columns = [
    { 
      field: "ProjectID", 
      headerName: "ID", 
      width: 90, 
      align: "center" // Centers cell content horizontally
    },
    { 
      field: "ProjectName", 
      headerName: "Project Name", 
      width: 200, 
      flex: 1, 
      wrap: true, 
      align: "center", // Centers cell content horizontally
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: "0 8px",
            textAlign: "center",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    { 
      field: "NumberOfDays", 
      headerName: "Number of Days", 
      width: 150, 
      align: "center", // Centers cell content horizontally
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: "0 8px",
            textAlign: "center",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    { 
      field: "ProjectStartDate", 
      headerName: "Start Date", 
      width: 150, 
      align: "center", // Centers cell content horizontally
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: "0 8px",
            textAlign: "center",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "Technology",
      headerName: "Technology",
      width: 200,
      flex: 1,
      align: "center", // Centers cell content horizontally
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: "0 8px",
            textAlign: "center",
          }}
        >
          {params.value.join(", ")}
        </Box>
      ),
    },
    {
      field: "Domain",
      headerName: "Domain",
      width: 200,
      flex: 1,
      align: "center", // Centers cell content horizontally
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: "0 8px",
            textAlign: "center",
          }}
        >
          {params.value.join(", ")}
        </Box>
      ),
    },
    {
      field: "RequiredResources",
      headerName: "Required Resources",
      width: 250,
      flex: 1,
      align: "center", // Centers cell content horizontally
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Button
            size="small"
            variant="contained"
            onClick={(event) =>
              handlePopoverOpen(event, params.row.RequiredResources, "RequiredResources")
            }
            aria-label="View Required Resources"
          >
            View Resources
          </Button>
        </Box>
      ),
    },
  ];

  // Helper function to extract all searchable data from a row
  const flattenRowData = (row) => {
    let flatData = "";

    // Include top-level fields
    flatData += Object.values(row)
      .filter((value) => typeof value === "string" || typeof value === "number")
      .join(" ")
      .toLowerCase();

    // Include Technology
    if (row.Technology && Array.isArray(row.Technology)) {
      flatData += " " + row.Technology.join(" ").toLowerCase();
    }

    // Include Domain
    if (row.Domain && Array.isArray(row.Domain)) {
      flatData += " " + row.Domain.join(" ").toLowerCase();
    }

    // Include Required Resources
    if (row.RequiredResources && Array.isArray(row.RequiredResources)) {
      flatData +=
        " " +
        row.RequiredResources
          .map(
            (resource) =>
              `${resource.Role} ${Object.keys(resource.Skills).join(" ")}`
          )
          .join(" ")
          .toLowerCase();
    }

    return flatData;
  };

  // Filtered rows based on the search query and date filter
  const filteredRows = data
    .filter((row) => {
      const rowData = flattenRowData(row);
      const matchesSearch = searchQuery
        .toLowerCase()
        .split(" ")
        .every((word) => rowData.includes(word));

      let matchesDate = true;
      if (availableDateFilter) {
        // Assuming ProjectStartDate is in YYYY-MM-DD format
        matchesDate = row.ProjectStartDate >= availableDateFilter;
      }

      return matchesSearch && matchesDate;
    })
    .map((project) => ({
      id: project.ProjectID, // Use ProjectID as the unique identifier
      ...project,
    }));

  console.log(filteredRows);

  const addRow = () => {
    console.log("New Project Added");
    // Implement the logic to add a new project
  };

  return (
    <Paper
      style={{
        padding: 16,
        marginTop: 20,
        marginBottom: 20,
        maxWidth: isSmallScreen ? "95%" : "90%",
        margin: "0 auto",
      }}
    >
      <Typography variant="h6" gutterBottom align="center">
        Project Data
      </Typography>
      <Grid container spacing={2} alignItems="center">
        {/* Search Filter */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, technology, domain, etc."
          />
        </Grid>

        {/* Date Filter */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Project Start Date From"
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

        {/* Add New Project Button */}
        <Grid item xs={20} sm={20} md={4} style={{ textAlign: "center" }}>
          <Button
            size="medium"
            variant="contained"
            onClick={addRow}
            sx={{ marginBottom: "10px" }}
          >
            Add New Project
          </Button>
        </Grid>
      </Grid>

      <Box mt={4}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          loading={loading}
          disableColumnMenu
          autoHeight
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          sx={{
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              whiteSpace: "normal",
              wordBreak: "break-word",
              lineHeight: "1.5",
              maxHeight: "none !important",
            },
            // Removed header alignment styles to keep headers left-aligned
            "& .MuiDataGrid-virtualScroller": {
              overflow: "auto",
            },
          }}
        />
      </Box>

      {/* Popover for More Details */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Paper style={{ padding: "16px", maxWidth: "400px" }}>
          <List dense>
            {contentType === "RequiredResources" &&
              popoverContent &&
              popoverContent.map((resource, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemText
                    primary={
                      <strong>
                        {resource.Role} (Quantity: {resource.Quantity})
                      </strong>
                    }
                    secondary={
                      <List>
                        {Object.entries(resource.Skills).map(
                          ([skill, details]) => (
                            <ListItem key={skill} disableGutters>
                              <ListItemText
                                primary={`${skill} - Level: ${details.level}`}
                                primaryTypographyProps={{ variant: "body2", align: "center" }} // Center text in popover
                              />
                            </ListItem>
                          )
                        )}
                      </List>
                    }
                  />
                </ListItem>
              ))}
          </List>
        </Paper>
      </Popover>
    </Paper>
  );
};

export default Projects;
