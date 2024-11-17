// src/components/Projects.jsx

import React, { useEffect, useState, useMemo } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import projectsAPI from "../../api/projects";
import debounce from "lodash.debounce"; // For debouncing search input

const Projects = () => {
  // Data States
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [availableDateFilter, setAvailableDateFilter] = useState("");

  // Popover States
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverContent, setPopoverContent] = useState([]);
  const [contentType, setContentType] = useState("");

  // Modal States for Adding New Project
  const [openModal, setOpenModal] = useState(false);
  const [newProject, setNewProject] = useState({
    ProjectName: "",
    NumberOfDays: "",
    ProjectStartDate: "",
    Technology: [],
    Domain: [],
    RequiredResources: [],
  });

  // Media Query for Responsive Design
  const isSmallScreen = useMediaQuery("(max-width:768px)");

  // Debounced Search Handler
  const debouncedSetSearchQuery = useMemo(
    () => debounce((value) => setSearchQuery(value), 300),
    []
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSetSearchQuery.cancel();
    };
  }, [debouncedSetSearchQuery]);

  // Fetch projects from the API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null); // Reset previous errors
      const projects = await projectsAPI.getProjects();
      setData(projects);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect to fetch data on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle Popover Open
  const handlePopoverOpen = (event, content, type) => {
    setAnchorEl(event.currentTarget);
    setPopoverContent(content);
    setContentType(type); // Set the type of content to display (RequiredResources)
  };

  // Handle Popover Close
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // Handle Modal Open
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // Handle Modal Close
  const handleCloseModal = () => {
    setOpenModal(false);
    setNewProject({
      ProjectName: "",
      NumberOfDays: "",
      ProjectStartDate: "",
      Technology: [],
      Domain: [],
      RequiredResources: [],
    });
  };

  // Handle Form Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Form Submission
  const handleFormSubmit = async () => {
    try {
      setLoading(true);
      const addedProject = await projectsAPI.addProject(newProject);
      setData((prevData) => [...prevData, addedProject]);
      handleCloseModal();
    } catch (err) {
      console.error("Error adding project:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Define Columns for DataGrid
  const columns = [
    { 
      field: "ProjectID", 
      headerName: "ID", 
      width: 90, 
      align: "center",
      headerAlign: "center",
    },
    { 
      field: "ProjectName", 
      headerName: "Project Name", 
      width: 200, 
      flex: 1, 
      wrap: true, 
      align: "center",
      headerAlign: "center",
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
      align: "center",
      headerAlign: "center",
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
      align: "center",
      headerAlign: "center",
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
      align: "center",
      headerAlign: "center",
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
      align: "center",
      headerAlign: "center",
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
      align: "center",
      headerAlign: "center",
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

  // Memoize filteredRows for performance optimization
  const filteredRows = useMemo(() => {
    return (data || [])
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
  }, [data, searchQuery, availableDateFilter]);

  console.log(filteredRows);

  return (
    <Paper
      style={{
        padding: 16,
        marginTop: 40, // Increased top margin for better spacing
        marginBottom: 20,
        maxWidth: isSmallScreen ? "95%" : "90%",
        marginLeft: "auto",
        marginRight: "auto",
      }}
      elevation={3} // Adds a subtle shadow for depth
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
            onChange={(e) => debouncedSetSearchQuery(e.target.value)}
            placeholder="Search by name, technology, domain, etc."
            aria-label="Search Projects"
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
            aria-label="Filter Projects by Start Date"
          />
        </Grid>

        {/* `Add Ne`w Project Button */}
        <Grid item xs={12} sm={12} md={4} style={{ textAlign: "center" }}>
          <Button
            size="medium"
            variant="contained"
            onClick={handleOpenModal}
            sx={{ marginBottom: "10px" }}
            aria-label="Add New Project"
          >
            Add New Project
          </Button>
        </Grid>
      </Grid>

      {/* Display loading indicator */}
      {loading && (
        <Typography variant="h6" align="center" style={{ marginTop: '20px' }}>
          Loading projects...
        </Typography>
      )}

      {/* Display generic error message if any */}
      {error && (
        <Typography color="error" variant="body1" align="center">
          Something went wrong. Please try again.
        </Typography>
      )}

      {/* Always display the DataGrid */}
      <Box mt={4} display="flex" justifyContent="center">
        <Box sx={{ width: "100%", maxWidth: "1200px" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            disableColumnMenu
            autoHeight
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            loading={loading} // DataGrid shows built-in loading overlay
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
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5",
              },
              "& .MuiDataGrid-virtualScroller": {
                overflow: "auto",
              },
            }}
            // Custom overlay for no rows
            components={{
              NoRowsOverlay: () => (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <Typography variant="body1" color="textSecondary">
                    No projects found.
                  </Typography>
                </Box>
              ),
            }}
          />
        </Box>
      </Box>

      {/* Add Project Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Add New Project</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Project Name"
            name="ProjectName"
            fullWidth
            variant="outlined"
            value={newProject.ProjectName}
            onChange={handleInputChange}
            aria-label="Project Name"
          />
          <TextField
            margin="dense"
            label="Number of Days"
            name="NumberOfDays"
            type="number"
            fullWidth
            variant="outlined"
            value={newProject.NumberOfDays}
            onChange={handleInputChange}
            aria-label="Number of Days"
          />
          <TextField
            margin="dense"
            label="Project Start Date"
            name="ProjectStartDate"
            type="date"
            fullWidth
            variant="outlined"
            value={newProject.ProjectStartDate}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
            aria-label="Project Start Date"
          />
          {/* Add more fields as necessary, such as Technology, Domain, Required Resources */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary" aria-label="Cancel Adding Project">
            Cancel
          </Button>
          <Button onClick={handleFormSubmit} color="primary" aria-label="Confirm Adding Project">
            Add
          </Button>
        </DialogActions>
      </Dialog>

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
