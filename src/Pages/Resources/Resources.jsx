// src/components/Resources.jsx

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
import resourcesAPI from "../../api/resources";
import { useOrganization } from "@clerk/clerk-react";
import debounce from "lodash.debounce"; // For debouncing search input

const Resources = () => {
  // Retrieve organization information from Clerk
  const { organization } = useOrganization();
  const orgId = organization?.id; // Use optional chaining to avoid errors if organization is undefined

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

  // Modal States for Adding New Resource
  const [openModal, setOpenModal] = useState(false);
  const [newResource, setNewResource] = useState({
    Name: "",
    Rate: "",
    Domain: [],
    AvailableDate: "",
    Skills: {},
    PastJobTitles: {},
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

  // Fetch resources from the API
  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null); // Reset previous errors
      const resources = await resourcesAPI.getResources(orgId);
      setData(resources);
    } catch (err) {
      console.error("Error fetching resources:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect to fetch data on component mount and when orgId changes
  useEffect(() => {
    if (orgId) {
      fetchResources();
    } else {
      setLoading(false); // Stop loading if orgId is not available
      setError(new Error("Organization ID not found."));
    }
  }, [orgId]);

  // Handle Popover Open
  const handlePopoverOpen = (event, content, type) => {
    setAnchorEl(event.currentTarget);
    setPopoverContent(content);
    setContentType(type); // Set the type of content to display (Skills or Past Job Titles)
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
    setNewResource({
      Name: "",
      Rate: "",
      Domain: [],
      AvailableDate: "",
      Skills: {},
      PastJobTitles: {},
    });
  };

  // Handle Form Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResource((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Form Submission
  const handleFormSubmit = async () => {
    try {
      setLoading(true);
      const addedResource = await resourcesAPI.addResource(newResource);
      setData((prevData) => [...prevData, addedResource]);
      handleCloseModal();
    } catch (err) {
      console.error("Error adding resource:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Define Columns for DataGrid
  const columns = [
    { 
      field: "ResourceID", 
      headerName: "ID", 
      width: 90, 
      align: "center",
      headerAlign: "center",
    },
    { 
      field: "Name", 
      headerName: "Name", 
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
      field: "Rate", 
      headerName: "Rate", 
      width: 180, 
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
      field: "Domain",
      headerName: "Domain",
      width: 290,
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
      field: "AvailableDate", 
      headerName: "Available Date", 
      width: 200, 
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
      field: "Details",
      headerName: "Details",
      width: 240,
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
            gap: 1, // Adds spacing between buttons
            padding: "0 8px",
          }}
        >
          <Button
            size="small"
            variant="contained"
            onClick={(event) =>
              handlePopoverOpen(event, params.row.Skills, "Skills")
            }
            aria-label="View Skills"
          >
            Skills
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={(event) =>
              handlePopoverOpen(
                event,
                params.row.PastJobTitles,
                "Past Job Titles"
              )
            }
            aria-label="View Past Job Titles"
          >
            Past Job Titles
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

    // Include Skills
    if (row.Skills) {
      flatData +=
        " " +
        Object.entries(row.Skills)
          .map(([skill, details]) => `${skill} ${details.level}`)
          .join(" ")
          .toLowerCase();
    }

    // Include Past Job Titles
    if (row.PastJobTitles) {
      flatData +=
        " " +
        Object.entries(row.PastJobTitles)
          .map(([title, details]) => `${title} ${details.years}`)
          .join(" ")
          .toLowerCase();
    }

    // Include Domain
    if (row.Domain && Array.isArray(row.Domain)) {
      flatData += " " + row.Domain.join(" ").toLowerCase();
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
          // Assuming AvailableDate is in YYYY-MM-DD format
          matchesDate = row.AvailableDate >= availableDateFilter;
        }

        return matchesSearch && matchesDate;
      })
      .map((resource) => ({
        id: resource.ResourceID, // Use ResourceID as the unique identifier for DataGrid
        ...resource,
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
        Resource Data
      </Typography>
      <Grid container spacing={2} alignItems="center">
        {/* Search Filter */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            onChange={(e) => debouncedSetSearchQuery(e.target.value)}
            placeholder="Search by name, domain, skills, etc."
          />
        </Grid>

        {/* Date Filter */}
        <Grid item xs={12} sm={6} md={4}>
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

        {/* Add New Resource Button */}
        <Grid item xs={12} sm={12} md={4} style={{ textAlign: "center" }}>
          <Button
            size="medium"
            variant="contained"
            onClick={handleOpenModal}
            sx={{ marginBottom: "10px" }}
            aria-label="Add New Resource"
          >
            Add New Resource
          </Button>
        </Grid>
      </Grid>

      {/* Display loading indicator */}
      {loading && (
        <Typography variant="h6" align="center" style={{ marginTop: '20px' }}>
          Loading resources...
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
              // Ensure the virtual scroller doesn't restrict overflow
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
                    No resources found.
                  </Typography>
                </Box>
              ),
            }}
          />
        </Box>
      </Box>

      {/* Add Resource Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Add New Resource</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="Name"
            fullWidth
            variant="outlined"
            value={newResource.Name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Rate"
            name="Rate"
            type="number"
            fullWidth
            variant="outlined"
            value={newResource.Rate}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Available Date"
            name="AvailableDate"
            type="date"
            fullWidth
            variant="outlined"
            value={newResource.AvailableDate}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          {/* Add more fields as necessary, such as Domain, Skills, Past Job Titles */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleFormSubmit} color="primary">
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
        <Paper style={{ padding: "16px", maxWidth: "300px" }}>
          <List dense>
            {contentType === "Skills" &&
              popoverContent &&
              Object.entries(popoverContent).map(([skill, { level }]) => (
                <ListItem key={skill} disableGutters>
                  <ListItemText
                    primary={<strong>{skill}</strong>}
                    secondary={`Level: ${level}`}
                    primaryTypographyProps={{ variant: "subtitle1", align: "center" }}
                    secondaryTypographyProps={{ color: "textSecondary", align: "center" }}
                  />
                </ListItem>
              ))}
            {contentType === "Past Job Titles" &&
              popoverContent &&
              Object.entries(popoverContent).map(([title, { years }]) => (
                <ListItem key={title} disableGutters>
                  <ListItemText
                    primary={<strong>{title}</strong>}
                    secondary={`Experience: ${years} years`}
                    primaryTypographyProps={{ variant: "subtitle1", align: "center" }}
                    secondaryTypographyProps={{ color: "textSecondary", align: "center" }}
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
