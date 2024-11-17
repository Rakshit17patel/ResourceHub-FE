import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { useUser, useOrganization } from '@clerk/clerk-react';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { PAGE_URLS } from '../../Router';
import { Link } from 'react-router-dom';



const Dashboard = () => {
  const { user } = useUser();
  const { organization } = useOrganization();
  console.log(organization);

  const quotes = [
    "The strength of the team is each individual member - Phil Jackson",
    "Alone we can do so little; together we can do so much - Helen Keller",
    "Teamwork makes the dream work - John C. Maxwell",
    "Great things in business are never done by one person - Steve Jobs",
    "Success is best when it’s shared - Howard Schultz",
    "None of us is as smart as all of us - Ken Blanchard",
    "Coming together is a beginning. Keeping together is progress. Working together is success - Henry Ford",
    "The way a team plays as a whole determines its success - Babe Ruth",
    "If everyone is moving forward together, then success takes care of itself - Henry Ford",
    "Effort and courage are not enough without purpose and direction - John F. Kennedy",
    "Individually, we are one drop. Together, we are an ocean - Ryunosuke Satoro",
    "The best teamwork comes from men who are working independently toward one goal - James Cash Penney",
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  const performanceData = {
    totalProjects: 12,
    activeResources: 35,
    utilizationRate: 85,
    pendingAssignments: 5,
  };

  const latestProjects = [
    { name: "Project Alpha", status: "In Progress" },
    { name: "Project Beta", status: "Completed" },
    { name: "Project Gamma", status: "Pending" },
    { name: "Project Delta", status: "In Progress" },
  ];

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    const storedNotes = sessionStorage.getItem('userNotes');
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('userNotes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, newNote.trim()]);
      setNewNote('');
    }
  };

  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 ,mb:10}}>
      {/* Greeting and Quote */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user.firstName || 'User'}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          "{randomQuote}"
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {!organization && (
          <Grid item xs={12}>
            {/* Notes Section for No Org ID */}
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Your Notes
                </Typography>
                <Box display="flex" gap={2} mb={2}>
                  <TextField
                    label="Add a new note"
                    variant="outlined"
                    fullWidth
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <Button variant="contained" color="primary" onClick={addNote}>
                    Add
                  </Button>
                </Box>
                <List>
                  {notes.length > 0 ? (
                    notes.map((note, index) => (
                      <ListItem
                        key={index}
                        secondaryAction={
                          <IconButton edge="end" onClick={() => deleteNote(index)}>
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText primary={note} />
                      </ListItem>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No notes yet. Add your first note!
                    </Typography>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {organization && (
          <Grid item xs={12}>
            {/* Rectangle Container */}
            <Card elevation={3} sx={{ borderRadius: 4, p: 4, mb: 4 }}>
              <Grid container spacing={4}>
                {/* Quick Actions */}
                  <Grid item xs={12}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<GroupIcon />}
                component={Link}
                to={PAGE_URLS.RESOURCES} // Navigate to Resources
              >
                Resources
              </Button>
            </Grid>
            <Grid item xs={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<AssignmentIcon />}
                component={Link}
                to={PAGE_URLS.PROJECTS} // Navigate to Projects
              >
                Projects
              </Button>
            </Grid>
            <Grid item xs={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<BarChartIcon />}
                component={Link}
                to={PAGE_URLS.TEAMS} // Navigate to Teams
              >
                Teams
              </Button>
            </Grid>
            <Grid item xs={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<TrendingUpIcon />}
                component={Link}
                to={PAGE_URLS.ANALYTICS} // Navigate to Analytics
              >
                Analytics
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Grid>

                {/* Performance Analytics and Latest Projects */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Performance Analytics
                  </Typography>
                  <Typography>Total Projects: {performanceData.totalProjects}</Typography>
                  <Typography>Active Resources: {performanceData.activeResources}</Typography>
                  <Typography>Utilization Rate: {performanceData.utilizationRate}%</Typography>
                  <Typography>Pending Assignments: {performanceData.pendingAssignments}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Latest Projects
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Project Name</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {latestProjects.map((project, index) => (
                          <TableRow key={index}>
                            <TableCell>{project.name}</TableCell>
                            <TableCell>{project.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                {/* Notes Section */}
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Your Notes
                    </Typography>
                    <Box display="flex" gap={2} mb={2}>
                      <TextField
                        label="Add a new note"
                        variant="outlined"
                        fullWidth
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={addNote}
                      >
                        Add
                      </Button>
                    </Box>
                    <List>
                      {notes.length > 0 ? (
                        notes.map((note, index) => (
                          <ListItem
                            key={index}
                            secondaryAction={
                              <IconButton
                                edge="end"
                                onClick={() => deleteNote(index)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            }
                          >
                            <ListItemText primary={note} />
                          </ListItem>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No notes yet. Add your first note!
                        </Typography>
                      )}
                    </List>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;
