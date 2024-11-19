import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock data for charts
const projectProgressData = [
  { name: "Completed", value: 400 },
  { name: "In Progress", value: 300 },
  { name: "Delayed", value: 100 },
];

const resourceAllocationData = [
  { name: "Team A", value: 20 },
  { name: "Team B", value: 15 },
  { name: "Team C", value: 25 },
  { name: "Team D", value: 18 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AnalyticsDashboard() {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Analytics Dashboard</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Filters */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Filters
              </Typography>
              <Grid container spacing={2}>
                {["Project", "Team", "Time Period", "Resource Role"].map(
                  (filter) => (
                    <Grid item xs={12} sm={6} md={3} key={filter}>
                      <FormControl fullWidth>
                        <InputLabel id={`${filter.toLowerCase()}-label`}>
                          {filter}
                        </InputLabel>
                        <Select
                          labelId={`${filter.toLowerCase()}-label`}
                          id={`${filter.toLowerCase()}-select`}
                          label={filter}
                          defaultValue=""
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={10}>Ten</MenuItem>
                          <MenuItem value={20}>Twenty</MenuItem>
                          <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  )
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Overview Section */}
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Overview
            </Typography>
            <Grid
              container
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              {[
                "Total Projects",
                "Projects Needing Resources",
                "Total Resources",
                "Unallocated Resources",
                "Resource Utilization Rate",
              ].map((metric) => (
                <Grid item xs={12} sm={6} md={4} lg={2} key={metric}>
                  <Card
                    sx={{
                      width: "200px",
                      height: "100px", // Reduced height
                      display: "flex", // Ensure Flexbox for alignment
                      flexDirection: "column",
                      justifyContent: "center", // Center content vertically
                      alignItems: "center", // Center content horizontally
                      textAlign: "center",
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 0, // Remove padding
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        color="textSecondary"
                        sx={{
                          margin: 1, // Remove extra margins
                          padding: 0, // Remove padding
                          fontSize: "14px", // Optional: Adjust font size
                          lineHeight: "1.2", // Control line spacing
                        }}
                      >
                        {metric}
                      </Typography>
                      <Typography
                        variant="h5"
                        component="div"
                        sx={{
                          marginTop: "4px", // Small gap between the title and number
                        }}
                      >
                        {Math.floor(Math.random() * 100)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Projects Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Project Progress
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectProgressData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {projectProgressData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Projects Needing Resources
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Project Name</TableCell>
                      <TableCell>Roles Required</TableCell>
                      <TableCell>Deadline to Fill</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[...Array(5)].map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>Project {index + 1}</TableCell>
                        <TableCell>
                          {Math.floor(Math.random() * 5) + 1}
                        </TableCell>
                        <TableCell>
                          {new Date(
                            Date.now() +
                              Math.random() * 10 * 24 * 60 * 60 * 1000
                          ).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Resources Section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Resource Allocation by Team
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={resourceAllocationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Efficiency Metrics */}
          <Grid item xs={12} mb={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Efficiency Metrics
              </Typography>
              {/* Add efficiency metrics visualizations here */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Average Time to Assign Resources
                      </Typography>
                      <Typography variant="h5" component="div">
                        {Math.floor(Math.random() * 10) + 1} days
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Resource Reassignment Count
                      </Typography>
                      <Typography variant="h5" component="div">
                        {Math.floor(Math.random() * 50) + 1}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
