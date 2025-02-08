import File from "../models/files.model.js";
import Assignment from "../models/assignment.models.js";
import { app } from "../utils/firebaseConfig.js";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject 
} from "firebase/storage";

import axios from "axios";
import Module from "../models/module.models.js";

const storage = getStorage(app);

export const fileUpload = async (req, res) => {
  try {
    const {
      referenceID,
      referenceCollection,
      fileCategory,
      uploadedByUserID,
      uploadedByUserName,
      writerFlag
    } = req.body;
    const storageRef = ref(storage, req.file.originalname);

    const metadata = {
      contentType: req.file.mimetype,
    };

    const uploadTask = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );

    const downloadURL = await getDownloadURL(uploadTask.ref);

    // Save the file data to MongoDB
    const newFile = new File({
      referenceID,
      referenceCollection,
      fileCategory,
      uploadedByUserID,
      uploadedByUserName,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileUrl: downloadURL,
    });

    await newFile.save();

    if (referenceCollection === "Assignment") {
      if (writerFlag) {
        // Add the new file ID to the assignment's `assignmentFile` array
        const assignment = await Assignment.findOne({ orderID: referenceID }); // Find the Assignment document by its ID);
        assignment.assignmentFile.push(newFile._id);
        // Save the updated assignment
        await assignment.save();
      } else {
        const assignment = await Assignment.findByIdAndUpdate(
          { _id: referenceID }, // Find the Assignment document by its ID
          { $push: { assignmentFile: newFile._id } }, // Push new file ID into "assignmentFile" array
          { new: true } // Return updated document
        );
      }
    } else if (referenceCollection === "Module") {
      const module = await Module.findByIdAndUpdate(
        {_id: referenceID}, // Find the Assignment document by its ID
        { $push: { assignmentFile: newFile._id } }, // Push new file ID into "assignmentFile" array
        { new: true } // Return updated document
      );
    }

    res
      .status(201)
      .json({ message: "File uploaded successfully", fileId: newFile._id });
  } catch (error) {
    console.log(error.message);
    return res.status(400).send(error.message);
  }
};

export const fileDownload = async (req, res) => {
  try {
    const { fileID } = req.params;
    const file = await File.findById(fileID);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    // Fetch the file from Firebase using axios
    const firebaseResponse = await axios.get(file.fileUrl, 
      { responseType: 'stream', 
      onDownloadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent;
      const progress = (loaded / total) * 100;
      console.log(`Download progress: ${progress.toFixed(2)}%`);
    } });

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`);
    res.setHeader('Content-Type', file.fileType);

    // Stream the file content to the client
    firebaseResponse.data.pipe(res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error downloading file", error: error.message });
  }
};

// Controller to handle file deletion by ID
export const fileDelete = async (req, res) => {
  try {
    const fileId = req.params.id;
    if (!fileId) {
      return res.status(400).json({ message: "File ID not found" });
    }

    // Find the file by ID and delete it from Mongo
    const deletedFile = await File.findByIdAndDelete(fileId);
    if (!deletedFile) {
      return res.status(404).json({ message: "File not found" });
    }
    // Find the file by fileName and delete it from Firebase
    const storageRef = ref(storage, deletedFile.fileName);
    deleteObject(storageRef).then(() => {
      console.log(`${deletedFile.fileName} deleted from Firebase`)
    }).catch((error) => {
      console.log(`Firebase file delete error: `+error.message)
    });

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error deleting file", error: error.message });
  }
};