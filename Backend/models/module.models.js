import mongo from 'mongoose';
import {infoDB} from '../db/connectMongoDB.js';

const moduleSchema = new mongo.Schema({
  moduleName: {
    type: String,
    required: true,
  },
  moduleCode: {
    type: String,
    required: true,
  },
  mainAssignments: [
    {
      assignmentName: {
        type: String,
      },
      assignmentType: {
        type: String,
      },
      assignmentDeadline: {
        type: Date,
      },
      referenceNumber: {
        type: String,
      },
    },
  ],
  moduleAssignments: [
    [
      {
        type: mongo.Schema.Types.ObjectId,
        ref: "Assignment",
        required: true,
      },
    ],
  ],
});

const Module = infoDB.model("Module", moduleSchema, "Module");
export default Module;