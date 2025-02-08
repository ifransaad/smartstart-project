import mongoose from "mongoose";
import { fileDB } from "../db/connectMongoDB.js";

const fileSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    referenceID: {
      type: mongoose.Schema.Types.ObjectId, // Stores ObjectId
      required: true,
    },
    referenceCollection: {
      type: String, // Stores collection name to identify source
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileCategory: {
      type: String,
      required: true,
    },
    uploadedByUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    uploadedByUserName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const File = fileDB.model("File", fileSchema, "File");

export default File;
