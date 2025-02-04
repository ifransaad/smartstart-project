import Degree from "../models/degree.models.js";
import Module from "../models/module.models.js";
import ModuleStudentFinance from "../models/moduleStudentFinance.models.js";

export const addNewPayment = async (paymentRequiredInformation) => {
  const { degreeID, assignmentID, moduleCode, studentID } =
    paymentRequiredInformation;
  // Find the module ID using the moduleCode
  const module = await Module.findOne({
    moduleCode,
  }).select("_id moduleName moduleCode");
  const degree = await Degree.findOne({
    degreeID
  }).select("degreeName degreeYear");;
  
  try {
    const newPayment = new ModuleStudentFinance({
      studentID,
      moduleID: module._id,
      degreeID,
      degreeName: degree.degreeName,
      degreeYear: degree.degreeYear,
      moduleName: module.moduleName,
    });
    await newPayment.save();
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getPaymentDetails = async (req, res) => {
    const { assignmentID, moduleCode, studentID } = req.body;
    try {
    // Find the module ID using the moduleCode
    const module = await Module.findOne({ moduleCode });
    if (!module) {
        return res.status(404).json({ error: "Module not found" });
    }

    // Find all records in ModuleStudentFinance where studentID and moduleID match
    const finances = await ModuleStudentFinance.find({
        studentID,
        moduleID: module._id,
    });

    res.status(200).json(finances[0] );
    } catch (error) {
        console.error("Error fetching finance data:", error);
        res.status(500).json({ error: "An error occurred while fetching data" });
    }
};

export const getPaymentDetailsByType = async (req, res) => {  
  try {
    // Find all records in ModuleStudentFinance where studentID and moduleID match
    const finances = await ModuleStudentFinance.find();
    res.status(200).json(finances);
  } catch (error) {
    console.error("Error fetching finance data:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

export const updatePaymentDetails = async (req, res) => {
  const {
    totalPaymentDue,
    totalPaymentToDate,
    paymentMethod,
    paymentAmount,
    paymentStatus,
    paidAmount,
    otherPaymentMethod,
    bankPaymentMethod,
    cashPaymentMethod,
    referredPaymentMethod,
    paymentRequiredInformation,
  } = req.body;
  try {
    const updateDetails = {};
    if (paymentAmount) updateDetails.modulePrice = paymentAmount;
    if (totalPaymentDue) updateDetails.totalPaymentDue = totalPaymentDue;
    if (totalPaymentToDate) updateDetails.totalPaymentToDate = totalPaymentToDate;
    if (paymentMethod) updateDetails.paymentMethod = paymentMethod;
    if (paymentStatus) updateDetails.paymentStatus = paymentStatus
    if (paidAmount) updateDetails.paidAmount = paidAmount;
    if (otherPaymentMethod) updateDetails.otherPaymentMethod = otherPaymentMethod;
    if (bankPaymentMethod) updateDetails.bankPaymentMethod = bankPaymentMethod;
    if (cashPaymentMethod) updateDetails.cashPaymentMethod = cashPaymentMethod;
    if (referredPaymentMethod) updateDetails.referredPaymentMethod = referredPaymentMethod;
    
    // Find the module ID using the moduleCode
    const module = await Module.findOne({
      moduleCode: paymentRequiredInformation.moduleCode,
    });
    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }

    // Find all records in ModuleStudentFinance where studentID and moduleID match
    const finances = await ModuleStudentFinance.findOne({
      studentID: paymentRequiredInformation.studentID,
      moduleID: module._id,
    });
    if (!finances) {
      addNewPayment(paymentRequiredInformation);
      return res
       .status(200)
       .json({ error: "New Payment Created." });
    }
    const paymentLog = createPaymentLog(finances, updateDetails)
    
    // Find the specific assignment by its ID and update it
    const payment = await ModuleStudentFinance.findByIdAndUpdate(
      finances._id,
      { $set: updateDetails, $push: { paymentLog } },
      { new: true } // Return the updated document
    );
    if (payment) {        
      res.status(200).json(payment);
    } else {
      res
        .status(404)
        .json({ error: "No payment found for the provided payment ID" });
    }
  } catch (error) {
    console.error("Error sending finance data:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

const createPaymentLog = (previousData, newData) => {
    let logString = ''    
    if (previousData.paidAmount && previousData.paymentMethod && previousData.totalPaymentDue){
        logString = `A PAYMENT WAS MADE OF ${Number(newData.paidAmount) - Number(previousData.paidAmount)} GBP at ${newData.totalPaymentToDate}. Remaining ${newData.totalPaymentDue} GBP`;
    } else {
      logString = `A PAYMENT IS SET FOR ${newData.totalPaymentDue} GBP`;
    }
    const date = new Date().toUTCString()
    return {date, logString}
    
}