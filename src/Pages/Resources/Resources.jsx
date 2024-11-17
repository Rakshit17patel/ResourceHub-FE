// src/components/Resources.js

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

const Resources = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // State to hold the search query
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverContent, setPopoverContent] = useState([]);
  const [contentType, setContentType] = useState("");
  const [availableDateFilter, setAvailableDateFilter] = useState("");

  const isSmallScreen = useMediaQuery("(max-width:768px)");

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/Resources");
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
    setContentType(type); // Set the type of content to display (Skills or Past Job Titles)
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const columns = [
    {
      field: "ResourceID",
      headerName: "ID",
      width: 90,
      align: "center", // Centers cell content horizontally
    },
    {
      field: "Name",
      headerName: "Name",
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
      field: "Rate",
      headerName: "Rate",
      width: 180,
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
      field: "Domain",
      headerName: "Domain",
      width: 290,
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
      field: "AvailableDate",
      headerName: "Available Date",
      width: 200,
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
      field: "Details",
      headerName: "Details",
      width: 240,
      flex: 1,
      align: "center", // Centers cell content horizontally
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
        matchesDate = row.AvailableDate >= availableDateFilter;
      }

      return matchesSearch && matchesDate;
    })
    .map((resource) => ({
      id: resource.ResourceID, // Use ResourceID as the unique identifier
      ...resource,
    }));

  console.log(filteredRows);

  const addRow = () => {
    console.log("New Resource Added");
    // Implement the logic to add a new resource
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
        Resource Data
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, domain, skills, etc."
          />
        </Grid>
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
        <Grid item xs={20} sm={20} md={4} style={{ textAlign: "center" }}>
          <Button
            size="medium"
            variant="contained"
            onClick={addRow}
            sx={{ marginBottom: "10px" }}
            aria-label="Add New Resource"
          >
            Add New Resource
          </Button>
        </Grid>
      </Grid>
      <Box mt={4} mb={8}>
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
            // Ensure the virtual scroller doesn't restrict overflow
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
        <Paper style={{ padding: "16px", maxWidth: "300px" }}>
          <List dense>
            {contentType === "Skills" &&
              popoverContent &&
              Object.entries(popoverContent).map(([skill, { level }]) => (
                <ListItem key={skill} disableGutters>
                  <ListItemText
                    primary={<strong>{skill}</strong>}
                    secondary={`Level: ${level}`}
                    primaryTypographyProps={{
                      variant: "subtitle1",
                      align: "center",
                    }}
                    secondaryTypographyProps={{
                      color: "textSecondary",
                      align: "center",
                    }}
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
                    primaryTypographyProps={{
                      variant: "subtitle1",
                      align: "center",
                    }}
                    secondaryTypographyProps={{
                      color: "textSecondary",
                      align: "center",
                    }}
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
