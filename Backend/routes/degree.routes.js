import express from "express"
import {newDegree,getAllDegree, getDegreeByYear, getDegreeByID, getDegreeByAgent} from '../controllers/degree.controller.js'
import { getAgentList } from "../controllers/auth.controller.js"
import {authenticate,adminAllowed} from '../middlewares/protect.js'

const router = express.Router();

router.use(authenticate);
router.post("/new",adminAllowed,newDegree);
router.get('/all',getAllDegree) ;
router.get('/selected/year/:degreeYear',getDegreeByYear) ;
router.get('/selected/degreeID/:degreeID',getDegreeByID) ;
router.get('/selected/agentID/:degreeAgent',getDegreeByAgent) ;
router.get('/agentlist',adminAllowed,getAgentList) ;

export default router;