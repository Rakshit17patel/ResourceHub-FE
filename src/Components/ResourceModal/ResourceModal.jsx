import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  IconButton,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import resourcesAPI from "../../api/resources";

const ResourceModal = ({ open, onClose, orgID }) => {
  const [loading, setLoading] = useState(false);
  //   const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      Name: "",
      Rate: "",
      Skills: {}, // Skills as an object
      PastJobTitles: {}, // Past Job Titles as an object
      Domain: [], // Domains remain unchanged
      AvailableDate: "",
    },
  });

  // Add/Remove Skills
  const addSkill = () => {
    const skills = watch("Skills") || {};
    setValue("Skills", { ...skills, "": { level: "" } });
  };

  const removeSkill = (key) => {
    const skills = { ...watch("Skills") };
    delete skills[key];
    setValue("Skills", skills);
  };

  // Add/Remove Past Job Titles
  const addJobTitle = () => {
    const jobs = watch("PastJobTitles") || {};
    setValue("PastJobTitles", { ...jobs, "": { years: "" } });
  };

  const removeJobTitle = (key) => {
    const jobs = { ...watch("PastJobTitles") };
    delete jobs[key];
    setValue("PastJobTitles", jobs);
  };

  const {
    fields: domainFields,
    append: addDomain,
    remove: removeDomain,
  } = useFieldArray({
    control,
    name: "Domain",
  });

  const handleFormSubmit = async (data) => {
    console.log(data);
    const resourceObject = {
      ...data,
      orgID: orgID,
      Skills: Object.fromEntries(
        Object.entries(data.Skills).filter(([key, value]) => key && value.level)
      ),
      PastJobTitles: Object.fromEntries(
        Object.entries(data.PastJobTitles).filter(
          ([key, value]) => key && value.years
        )
      ),
      TeamID: null,
    };

    try {
      setLoading(true);
      await resourcesAPI.postResource(orgID, resourceObject);
      reset();
      onClose();
      setSuccessMessage("Resource successfully added!"); // Trigger success message
    } catch (error) {
      setErrorMessage("Failed to add resource. Please try again."); // Trigger error message
      console.error("Error submitting resource:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSnackbarClose = () => {
    setSuccessMessage(false);
    setErrorMessage(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Add New Resource</DialogTitle>
        <DialogContent>
          <form
            id="resource-form"
            onSubmit={handleSubmit(handleFormSubmit)}
            sx={{ paddingTop: "10px" }}
          >
            <Grid container spacing={2} sx={{ marginBottom: "10px" }}>
              {/* Name */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="Name"
                  control={control}
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Name"
                      fullWidth
                      error={!!errors.Name}
                      helperText={errors.Name?.message}
                    />
                  )}
                />
              </Grid>

              {/* Rate */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="Rate"
                  control={control}
                  rules={{ required: "Rate is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Rate (USD)"
                      fullWidth
                      type="number"
                      error={!!errors.Rate}
                      helperText={errors.Rate?.message}
                    />
                  )}
                />
              </Grid>

              {/* Available Date */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="AvailableDate"
                  control={control}
                  rules={{ required: "Available Date is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Available Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.AvailableDate}
                      helperText={errors.AvailableDate?.message}
                    />
                  )}
                />
              </Grid>

              {/* Domains */}
              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sx={{ marginBottom: "10px" }}>
                    <strong>Domains:</strong>
                  </Grid>
                  {domainFields.map((domain, index) => (
                    <Grid
                      container
                      spacing={2}
                      key={domain.id}
                      sx={{ marginLeft: "0px", marginBottom: "10px" }}
                      alignItems="center"
                    >
                      <Grid item xs={10}>
                        <Controller
                          name={`Domain.${index}`}
                          control={control}
                          rules={{ required: "Domain is required" }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={`Domain ${index + 1}`}
                              fullWidth
                              error={!!errors.Domain?.[index]}
                              helperText={errors.Domain?.[index]?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton
                          onClick={() => removeDomain(index)}
                          color="error"
                        >
                          <RemoveCircleIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => addDomain("")} // Add an empty string for a new domain
                      startIcon={<AddCircleIcon />}
                    >
                      Add Domain
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              {/* Skills */}
              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sx={{ marginBottom: "10px" }}>
                    <strong>Skills:</strong>
                  </Grid>
                  {Object.entries(watch("Skills") || {}).map(
                    ([key, value], index) => (
                      <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        key={index}
                        sx={{ marginLeft: "0px", marginBottom: "10px" }}
                      >
                        <Grid item xs={5}>
                          <TextField
                            label="Skill Name"
                            value={key}
                            onChange={(e) => {
                              const skills = { ...watch("Skills") };
                              const newKey = e.target.value;
                              skills[newKey] = skills[key];
                              delete skills[key];
                              setValue("Skills", skills);
                            }}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <TextField
                            select
                            label="Skill Level"
                            value={value.level}
                            onChange={(e) => {
                              const skills = { ...watch("Skills") };
                              skills[key].level = e.target.value;
                              setValue("Skills", skills);
                            }}
                            fullWidth
                          >
                            <MenuItem value="beginner">Beginner</MenuItem>
                            <MenuItem value="intermediate">
                              Intermediate
                            </MenuItem>
                            <MenuItem value="expert">Expert</MenuItem>
                          </TextField>
                        </Grid>
                        <Grid item xs={2}>
                          <IconButton
                            onClick={() => removeSkill(key)}
                            color="error"
                          >
                            <RemoveCircleIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    )
                  )}
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={addSkill}
                      startIcon={<AddCircleIcon />}
                    >
                      Add Skill
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              {/* Past Job Titles */}
              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sx={{ marginBottom: "10px" }}>
                    <strong>Past Job Titles:</strong>
                  </Grid>
                  {Object.entries(watch("PastJobTitles") || {}).map(
                    ([key, value], index) => (
                      <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        key={index}
                        sx={{ marginLeft: "0px", marginBottom: "10px" }}
                      >
                        <Grid item xs={5}>
                          <TextField
                            label="Job Title"
                            value={key}
                            onChange={(e) => {
                              const jobs = { ...watch("PastJobTitles") };
                              const newKey = e.target.value;
                              jobs[newKey] = jobs[key];
                              delete jobs[key];
                              setValue("PastJobTitles", jobs);
                            }}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <TextField
                            label="Years"
                            type="number"
                            value={value.years}
                            onChange={(e) => {
                              const jobs = { ...watch("PastJobTitles") };
                              jobs[key].years = e.target.value;
                              setValue("PastJobTitles", jobs);
                            }}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <IconButton
                            onClick={() => removeJobTitle(key)}
                            color="error"
                          >
                            <RemoveCircleIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    )
                  )}
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={addJobTitle}
                      startIcon={<AddCircleIcon />}
                    >
                      Add Job Title
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="resource-form"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Saving..." : "Add Resource"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ResourceModal;

