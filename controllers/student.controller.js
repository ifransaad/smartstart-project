import Student from '../models/student.models.js';
import Degree from '../models/degree.models.js'

export async function getAllStudents(req, res) {
  try {
    // Find all students and return them
    const students = await Student.find({});
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    throw new Error("Failed to fetch students");
  }
}
// Function to add new students and return their MongoDB ObjectIDs
export async function addNewStudent(studentList) {
  try {    
    // Use Promise.all to save all students concurrently
    const addedStudentIDs = await Promise.all(
      studentList.map(async (studentData) => {
        // Finding the current student in database to see if the ID already exists in database;
        let currentStudent = await Student.findOne({
          studentID: studentData.studentID,
        });
        if(currentStudent){          
          // Update the current student with the new data
          const updatedStudent = await Student.findOneAndUpdate(
            { _id: currentStudent._id }, // Find the student by studentID
            {
              studentID: studentData.studentID,
              studentName: studentData.studentName,
              studentContact: studentData.studentContact,
              studentLogin: studentData.studentLogin,
              studentPassword: studentData.studentPassword,
              studentOfficePassword: studentData.studentOfficePassword,
              studentOther: studentData.studentOther,
            },
            { new: true } // Return the updated document
          );
          return updatedStudent._id;
        }else{
          // Create a new Student instance
          const newStudent = new Student({
          studentName: studentData.studentName,
          studentID: studentData.studentID,
          studentContact: studentData.studentContact,
          studentLogin: studentData.studentLogin, // Corrected field name
          studentPassword: studentData.studentPassword, // Corrected field name
          studentOfficePassword: studentData.studentOfficePassword,
          studentOther: studentData.studentOther,
        });

        // Save the student to the database and return the saved student's ObjectID
        const savedStudent = await newStudent.save();
        return savedStudent._id;
        }
      })
    );

    return addedStudentIDs; // Return the array of added student IDs
  } catch (error) {
    console.error("Error adding students:", error);
    throw new Error('Failed to add students');
  }
}

export const addStudentInDegree = async (req,res)=>{
  try{
    const {degreeID,studentName,studentID,studentContact,studentLogin,studentPassword,studentOfficePassword,studentOther} = req.body
    
    let currentStudent = await Student.findOne({studentID});
    if(currentStudent){
      return res.status(400).json({error:"Student ID already exists"});
    }else{
      // Create a new Student instance
      const newStudent = new Student({
      studentName,
      studentID,
      studentContact,
      studentLogin, 
      studentPassword,
      studentOfficePassword,
      studentOther
    });
    const savedStudent = await newStudent.save();
    if(savedStudent){
      await Degree.findOneAndUpdate({ degreeID: degreeID },{ $push: { degreeStudentList: savedStudent._id } } ).then(result => {
        if (result.matchedCount === 0) {
          console.log("No document found with the given _id.");
        } else {
          res.status(200).json({value:"Student added successfully"});
        }
      })
      .catch(err => {
        console.error("Error adding student:", err);
      });
    }

    }
    }catch (error) {
      console.error("Error adding student:", error);
      throw new Error('Failed to add student');
    }
  
}