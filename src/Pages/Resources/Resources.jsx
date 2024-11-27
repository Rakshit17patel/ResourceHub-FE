// src/components/Resources.jsx

import React, { useEffect, useState, useMemo } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import resourcesAPI from "../../api/resources";
import { useOrganization } from "@clerk/clerk-react";
import {ResourceModal} from "../../Components/ResourceModal";
import debounce from "lodash.debounce"; // For debouncing search input

const Resources = () => {
  // Retrieve organization information from Clerk
  const { organization } = useOrganization();
  const orgID = organization?.id; // Use optional chaining to avoid errors if organization is undefined


  // Data States
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [availableDateFilter, setAvailableDateFilter] = useState("");

  // Modal States
  const [openModal, setOpenModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  const [openFormModal, setOpenFormModal] = useState(false);

  // Handle form submission
  const handleAddResource = (newResource) => {
    console.log("New Resource Data:", newResource);
    // Add logic to save the resource (e.g., API call)
  };
  

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
      const resources = await resourcesAPI.getResources(orgID);
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
    if (orgID) {
      fetchResources();
    } else {
      setLoading(false); // Stop loading if orgId is not available
      setError(new Error("Organization ID not found."));
    }
  }, [orgID]);

  // Define Columns for DataGrid
  const columns = [
    {
      field: "ResourceID",
      headerName: "ID",
      width: 90, // Fixed width for ID
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "0 8px",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "Name",
      headerName: "Name",
      width: 400, // Reduced width
      flex: 0, // Prevents resizing based on flex
      align: "left",
      headerAlign: "left",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            padding: "0 8px",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "Domain",
      headerName: "Domain",
      width: 700, // Reduced width
      flex: 0, // Prevents resizing based on flex
      align: "left",
      headerAlign: "left",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            padding: "0 8px",
          }}
        >
          {params.value.join(", ")}
        </Box>
      ),
    },
    {
      field: "AvailableDate",
      headerName: "Available Date",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: "0 8px",
          }}
        >
          {params.value}
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

  // Handle row click to open modal
  const handleRowClick = (params) => {
    setSelectedResource(params.row);
    setOpenModal(true);
  };

  const handleOpenModal = () => setOpenFormModal(true);
  const handleCloseFormModal = () => {
    setOpenFormModal(false);
    fetchResources(); // Refresh data after modal submission
  };

  // Handle modal close
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedResource(null);
  };

  return (
    <Paper
      style={{
        padding: 16,
        marginTop: 40,
        marginBottom: 100,
        maxWidth: "90%",
        marginLeft: "auto",
        marginRight: "auto",
      }}
      elevation={3}
    >
      <Typography variant="h6" gutterBottom align="center">
        Resource Data
      </Typography>
      <Grid container spacing={2} alignItems="center">
        {/* Search Filter */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            onChange={(e) => debouncedSetSearchQuery(e.target.value)}
            placeholder="Search by name, domain, etc."
          />
        </Grid>

        {/* Date Filter */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="Available Date From"
            type="date"
            variant="outlined"
            fullWidth
            value={availableDateFilter}
            onChange={(e) => setAvailableDateFilter(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        {/* Add New Resource Button */}
        <Grid
          item
          xs={12}
          sm={4}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
            sx={{
              height: "56px", // Aligns with the height of TextField
              textTransform: "none",
              fontSize: "1rem", // Increases font size slightly
              padding: "10px 20px", // Adjust padding for better aesthetics
            }}
          >
            Add New Resource
          </Button>
        </Grid>
      </Grid>

      {/* Display loading or error */}
      {loading && (
        <Typography variant="h6" align="center" style={{ marginTop: "20px" }}>
          Loading resources...
        </Typography>
      )}
      {error && (
        <Typography color="error" variant="body1" align="center">
          Something went wrong. Please try again.
        </Typography>
      )}

      {/* DataGrid for displaying data */}
      <Box mt={4}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          disableColumnMenu
          autoHeight
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          loading={loading}
          onRowClick={handleRowClick}
          sx={{
            // Increase font size for table data
            "& .MuiDataGrid-cell, & .MuiDataGrid-columnHeaders": {
              fontSize: "1rem", // Adjust font size
              textAlign: "center", // Ensure consistent alignment
              padding: "8px 16px", // Adjust cell padding
            },
            // Make column headers bold
            // Make column header titles bold
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold", // Ensures column header text is bold
            },
            "& .MuiDataGrid-columnHeaders": {
              paddingLeft: "8px",
              paddingRight: "8px",
            },
            // Ensure table fits well for fewer columns
            "& .MuiDataGrid-root": {
              overflow: "hidden", // Avoid unnecessary scroll
              maxWidth: "700px", // Adjust width
              margin: "0 auto", // Center align table
            },
            // Adjust cell content alignment
            "& .MuiDataGrid-cellContent": {
              textAlign: "center", // Center text in cells
            },
          }}
        />
      </Box>

      {/* Modal for displaying resource details */}
      {selectedResource && (
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            style: { borderRadius: "12px", padding: "16px" },
          }}
        >
          <DialogTitle
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "1.5rem",
              marginBottom: "16px",
            }}
          >
            {selectedResource.Name}
          </DialogTitle>
          <DialogContent>
            <Box
              component="table"
              sx={{
                width: "100%",
                borderCollapse: "collapse", // Removes table borders
                "& td": { padding: "8px 0" }, // Adds spacing between rows
              }}
            >
              <tbody>
                <tr>
                  <td>
                    <Typography variant="body1">
                      <strong>ID:</strong>
                    </Typography>
                  </td>
                  <td>
                    <Typography variant="body1">
                      {selectedResource.ResourceID}
                    </Typography>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Typography variant="body1">
                      <strong>Rate:</strong>
                    </Typography>
                  </td>
                  <td>
                    <Typography variant="body1">
                      ${selectedResource.Rate}
                    </Typography>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Typography variant="body1">
                      <strong>Domain:</strong>
                    </Typography>
                  </td>
                  <td>
                    <Typography variant="body1">
                      {selectedResource.Domain.join(", ")}
                    </Typography>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Typography variant="body1">
                      <strong>Skills:</strong>
                    </Typography>
                  </td>
                  <td>
                    {Object.entries(selectedResource.Skills || {}).map(
                      ([skill, details]) => (
                        <Box
                          key={skill}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "8px",
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "500", marginRight: "4px" }}
                          >
                            {skill}
                          </Typography>
                          <Box
                            sx={{
                              backgroundColor:
                                details.level === "beginner"
                                  ? "#ffcccb" // Light red for beginner
                                  : details.level === "intermediate"
                                  ? "#ffeb99" // Light yellow for intermediate
                                  : "#c3f7c0", // Light green for expert
                              color: "black",
                              borderRadius: "8px",
                              padding: "4px 8px",
                              fontSize: "0.875rem",
                              fontWeight: "500",
                            }}
                          >
                            {details.level.charAt(0).toUpperCase() +
                              details.level.slice(1)}
                          </Box>
                        </Box>
                      )
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <Typography variant="body1">
                      <strong>Past Job Titles:</strong>
                    </Typography>
                  </td>
                  <td>
                    {Object.entries(selectedResource.PastJobTitles || {}).map(
                      ([title, details]) => (
                        <Box
                          key={title}
                          sx={{
                            display: "inline-block",
                            backgroundColor: "#fff3e0", // Light orange background
                            padding: "8px 12px",
                            borderRadius: "12px",
                            margin: "4px",
                            textAlign: "center",
                            minWidth: "120px",
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold", fontSize: "1rem" }}
                          >
                            {title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.875rem", color: "#555" }}
                          >
                            {details.years} years
                          </Typography>
                        </Box>
                      )
                    )}
                  </td>
                </tr>
              </tbody>
            </Box>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", padding: "16px" }}>
            <Button
              onClick={handleCloseModal}
              variant="contained"
              color="primary"
              sx={{
                textTransform: "none",
                padding: "8px 16px",
                fontSize: "1rem",
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <ResourceModal
      open={openFormModal}
      onClose={handleCloseFormModal} // Refresh data on close
      orgID={orgID} // Pass organization ID
    />
    </Paper>
  );
};

export default Resources;
