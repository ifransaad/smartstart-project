import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Button, TextField, Typography, Box, IconButton, Grid, Select, MenuItem, Tooltip, Snackbar, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { v4 as uuidv4 } from 'uuid';
import MuiAlert from '@mui/material/Alert';
import { tokens } from '../../theme';
import useSendDegreeForm from '../../hooks/useSendDegreeForm';

const currentYear = new Date().getFullYear();

const DegreeForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [open, setOpen] = useState(false);
    const [formSaved, setsetFormSaved] = useState(false);

    const { control, handleSubmit } = useForm({
        defaultValues: {
            degreeID: '',
            degreeYear: '',
            degreeName: '',
            degreeAgent: '',
            degreeStudentList: [{ studentID: '', studentName: '', studentContact: '', studentLogin: '', studentPassword: '', studentAssignmentList: [] }],
            degreeModules: [{ moduleName: '', moduleCode: '' }]
        }
    });

    const { fields: studentFields, append: appendStudent, remove: removeStudent } = useFieldArray({
        control,
        name: 'degreeStudentList'
    });

    const { fields: moduleFields, append: appendModule, remove: removeModule } = useFieldArray({
        control,
        name: 'degreeModules'
    });

    const {sendDegreeForm} = useSendDegreeForm();

    const onSubmit = data => {
        // console.log('Form Data:', data);
        const hoise = sendDegreeForm(data)
        console.log(hoise);
        
        setOpen(true); // Show success toast
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ p: 3, width: '80%', maxWidth: '80%', margin: '0 auto', mt: 5 ,
            '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderColor: colors.grey[300], // Default border color
                },
                '&.Mui-focused fieldset': {
                    borderColor: colors.grey[100], // Border color when focused
                },
            },
            '& .MuiInputLabel-root': {
                color: colors.grey[300], // Default label color
            },
            '& .MuiInputLabel-root.Mui-focused': {
                color: colors.grey[100], // Label color when focused
            },
        }}>
            <Typography variant="h4" gutterBottom>Degree Form</Typography>

            <form onSubmit={handleSubmit(onSubmit)}>

                <Box mb={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={2}>
                            <Tooltip title="Enter the Degree ID">
                                <Controller
                                    name="degreeID"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Degree ID"
                                            variant="outlined"
                                            fullWidth
                                            required
                                        />
                                    )}
                                />
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Box>

                <Box mb={2}>
                    
                    <Tooltip title="Select the Degree Year">
                        <Controller
                            name="degreeYear"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    variant="outlined"
                                    fullWidth
                                    displayEmpty
                                    required
                                >
                                    <MenuItem value="" disabled>
                                        Select Degree Year {/* Placeholder */}
                                    </MenuItem>
                                    {Array.from({ length: 30 }, (_, i) => (
                                        <MenuItem key={i} value={currentYear - i}>
                                            {currentYear - i}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </Tooltip>
                </Box>


                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Tooltip title="Enter the Degree Name">
                            <Controller
                                name="degreeName"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Degree Name"
                                        variant="outlined"
                                        fullWidth
                                        required
                                    />
                                )}
                            />
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Tooltip title="Enter the Agent Name">
                            <Controller
                                name="degreeAgent"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Agent Name"
                                        variant="outlined"
                                        fullWidth
                                        required
                                    />
                                )}
                            />
                        </Tooltip>
                    </Grid>
                </Grid>

                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Degree Students</Typography>
                {studentFields.map((field, index) => (
                    <Box key={field.id} sx={{ mb: 3, width: '100%' }}> {/* Reduced width by 10% */}
                        <Grid container spacing={2} alignItems="center"> {/* Align items vertically */}
                            <Grid item xs={11}> {/* All form fields will take up 11 columns */}
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                        <Tooltip title="Student ID (Auto-generated)">
                                            <Controller
                                                name={`degreeStudentList[${index}].studentID`}
                                                control={control}
                                                // defaultValue={field.studentID || uuidv4()} // Auto-generate UUID
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Student ID"
                                                        variant="outlined"
                                                        fullWidth
                                                    />
                                                )}
                                            />
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Tooltip title="Enter Student Name">
                                            <Controller
                                                name={`degreeStudentList[${index}].studentName`}
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Student Name"
                                                        variant="outlined"
                                                        fullWidth
                                                        required
                                                    />
                                                )}
                                            />
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Tooltip title="Enter Student Contact">
                                            <Controller
                                                name={`degreeStudentList[${index}].studentContact`}
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Student Contact"
                                                        variant="outlined"
                                                        fullWidth
                                                        required
                                                    />
                                                )}
                                            />
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Tooltip title="Enter Student Username">
                                            <Controller
                                                name={`degreeStudentList[${index}].studentLogin`}
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Student Username"
                                                        variant="outlined"
                                                        fullWidth
                                                        required
                                                    />
                                                )}
                                            />
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Tooltip title="Enter Student Password">
                                            <Controller
                                                name={`degreeStudentList[${index}].studentPassword`}
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Student Password"
                                                        variant="outlined"
                                                        fullWidth
                                                        required
                                                        // type="password"
                                                    />
                                                )}
                                            />
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={1} sx={{ alignSelf: 'flex-start' }}>
                                <Tooltip title="Remove Student">
                                    <IconButton
                                        onClick={() => removeStudent(index)}
                                        sx={{
                                            backgroundColor: 'grey',
                                            color: 'white',
                                            borderRadius: '50%',
                                            '&:hover': {
                                                backgroundColor: 'white',
                                                color: 'grey',
                                                cursor: 'pointer',
                                            },
                                        }}
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>

                        </Grid>
                    </Box>
                ))}

                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: colors.grey[200],
                        color: colors.grey[900],
                        '&:hover': {backgroundColor: colors.grey[100]}
                    }}
                    onClick={() => appendStudent({ studentID: '', studentName: '', studentContact: '', studentLogin: '', studentPassword: '', studentAssignmentList: [] })}
                    startIcon={<AddIcon />}
                >
                    Add Student
                </Button>

                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Degree Modules</Typography>
                {moduleFields.map((field, index) => (
                    <Box key={field.id} sx={{ mb: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Tooltip title="Enter Module Name">
                                    <Controller
                                        name={`degreeModules[${index}].moduleName`}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Module Name"
                                                variant="outlined"
                                                fullWidth
                                                required
                                            />
                                        )}
                                    />
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12} sm={5}>
                                <Tooltip title="Enter Module Code">
                                    <Controller
                                        name={`degreeModules[${index}].moduleCode`}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Module Code"
                                                variant="outlined"
                                                fullWidth
                                                required
                                            />
                                        )}
                                    />
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12} sm={1} sx={{ alignSelf: 'flex-start' }}>
                                <IconButton onClick={() => removeModule(index)}
                                            sx={{
                                                backgroundColor: 'grey',
                                                color: 'white',
                                                borderRadius: '50%',
                                                '&:hover': {
                                                    backgroundColor: 'white',
                                                    color: 'grey',
                                                    cursor: 'pointer',
                                                },
                                            }}
                                >
                                    <RemoveIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Box>
                ))}


                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4}}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: colors.grey[200],
                            color: colors.grey[900],
                            '&:hover': {backgroundColor: colors.grey[100]}
                        }}
                        onClick={() => appendModule({ moduleName: '', moduleCode: '' })}
                        startIcon={<AddIcon />}
                    >
                        Add Module
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            width: '200px',
                            backgroundColor: colors.grey[200],
                            color: colors.grey[900],
                            '&:hover': {backgroundColor: colors.grey[100]}
                        }}
                        type="submit"
                    >
                        Submit
                    </Button>
                </Box>

            </form>

            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity="success">
                    Form submitted successfully!
                </MuiAlert>
            </Snackbar>
        </Box>
    );
};

export default DegreeForm;