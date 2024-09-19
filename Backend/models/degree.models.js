import mongo from 'mongoose';
import {infoDB} from '../db/connectMongoDB.js';

const degreeSchema = new mongo.Schema({
    degreeID : {
        type: String,
        required: true,
        unique: true
    },
    degreeName:{
        type: String,
        required: true
    },
    degreeYear: {
        type: String,
        required: true
    },
    degreeAgent:{
        type: String,
        required: true
    },
    degreeStudentList:[{
        type: mongo.Schema.Types.ObjectId,
        ref:"Student"
    }],
    degreeModules:[{
        moduleName: { type: String}, // Name of the module
        moduleCode: { type: String}  // Code of the module
    }]
})
const Degree = infoDB.model("Degree", degreeSchema,"Degree");
export default Degree;