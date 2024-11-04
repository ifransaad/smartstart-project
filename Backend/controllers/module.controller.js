import ModuleAssignment from '../models/moduleAssignment.models.js';
import Assignment from '../models/assignment.models.js';
import Degree from '../models/degree.models.js';
import Module from '../models/module.models.js';
import mongoose from 'mongoose';
import { newAssignmentDynamic } from './assignment.controllers.js';

// New helper function to add the assignment to the Module model
export const addNewModule = async(moduleList) =>  {
  try {
    // Use Promise.all to save all Module concurrently    
    const addedModuleIDs = await Promise.all(
      moduleList.map(async (moduleData) => {
        // Finding the current Module in database to see if the ID already exists in database;
        let currentModule = await Module.findOne({
          moduleCode: moduleData.moduleCode,
        });
        if (currentModule) {          
          return currentModule._id;
        } else {
          // Create a new Student instance
          const newModule = new Module({
            moduleName: moduleData.moduleName,
            moduleCode: moduleData.moduleCode,
            moduleAssignments: await newAssignmentDynamic(moduleData.assignmentList),
          });

          // Save the student to the database and return the saved module's ObjectID
          const savedModule = await newModule.save();
          return savedModule._id;
          
        }
      })
    );    
    return addedModuleIDs; // Return the array of added student IDs
  } catch (error) {
    console.error("Error adding Modules:", error);
    throw new Error("Failed to add Modules");
  }
}

// Helper function to create a new assignment
async function moduleCreateNewAssignment(orderID, assignmentName, assignmentType, assignmentDeadline, assignmentProgress, assignmentPayment, assignmentGrade) {
  try {
    const newAssignment = new Assignment({
      orderID,
      assignmentName,
      assignmentType,
      assignmentDeadline,
      assignmentProgress,
      assignmentPayment,
      assignmentGrade,
      assignmentFile: [] // Default to an empty array
    });
    return await newAssignment.save();
  } catch (error) {
    console.error("Error creating new assignment:", error);
    throw new Error("Failed to create new assignment");
  }
}

// New helper function to add the assignment to the Module model
async function moduleAddAssignmentToModule(moduleID, assignment) {
  try {
    const module = await Module.findOne({ _id: moduleID });
    if (module) {
      module.moduleAssignments.push({
        assignmentID: assignment._id,
        assignmentName: assignment.assignmentName,
        assignmentType: assignment.assignmentType,
        assignmentDeadline: assignment.assignmentDeadline
      });
      await module.save();
    } else {
      console.error("Module not found with the provided moduleID");
    }
  } catch (error) {
    console.error("Error adding assignment to module:", error);
    throw new Error("Failed to add assignment to module");
  }
}

// Function to create a new assignment and update relevant records
export const newAssignment = async (req, res) => {
  try {
    const { assignmentName, assignmentType, assignmentDeadline, orderID, moduleID, assignmentProgress, assignmentPayment, assignmentGrade } = req.body;

    // Check if required fields are provided
    if (!assignmentName || !assignmentType || !assignmentDeadline) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const newAssignment = new Assignment({
      assignmentName,
      assignmentType,
      assignmentDeadline,
      assignmentProgress,
      assignmentPayment,
      assignmentGrade,
      assignmentFile: [] // Default to an empty array
    });

    // Step 1: Fetch the degree associated with the moduleID
    const degree = await Degree.findOne({ degreeModules: { $elemMatch: { moduleCode: moduleCode } } });

    if (!degree) {
      return res.status(404).json({ error: "Degree not found" });
    }

    const studentList = degree.degreeStudentList;

    // Step 2: Create the new assignment
    const createdAssignment = await moduleCreateNewAssignment(orderID, assignmentName, assignmentType, assignmentDeadline, assignmentProgress, assignmentPayment, assignmentGrade);

    // Step 3: Update ModuleAssignment for each student in the degree
    await Promise.all(studentList.map(async (studentID) => {
      await ModuleAssignment.findOneAndUpdate(
        { moduleID, studentID },
        {
          $setOnInsert: { studentID, moduleID },
          $addToSet: {
            assignments: {
              orderID: createdAssignment.orderID,
              assignmentName: createdAssignment.assignmentName,
              assignmentType: createdAssignment.assignmentType,
              assignmentDeadline: createdAssignment.assignmentDeadline,
            }
          }
        },
        { upsert: true }
      );
    }));

    // Step 4: Also add the assignment to the Module model
    await moduleAddAssignmentToModule(moduleID, createdAssignment);

    res.status(200).json({ message: "Assignment added and propagated to all students in the degree successfully" });
  } catch (error) {
    console.error("Error in newAssignment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAssignment = async (req, res) => {
  try {
    const { studentID, moduleID } = req.params;

    const moduleAssignment = await ModuleAssignment.findOne({
      moduleID: new mongoose.Types.ObjectId(moduleID),
      studentID: new mongoose.Types.ObjectId(studentID)
    }).populate({
      path: 'orderID',
      model: 'Assignment',
      foreignField: 'orderID'
    });

    if (moduleAssignment) {
      res.status(200).json(moduleAssignment.orderID);
    } else {
      res.status(404).json({ error: "No module found for the provided student and module" });
    }
  } catch (error) {
    console.error("Error fetching assignment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
