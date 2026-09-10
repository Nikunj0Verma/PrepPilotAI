const express = require("express");
const router = express.Router();

const companyController = require("../controller/companyController");
const authMiddleware = require("../middleware/authMiddleware");

const companyRouter = express.Router();
companyRouter.post("/details", authMiddleware, companyController.details);
companyRouter.post("/analysis/:id",authMiddleware,companyController.analysis);
companyRouter.get("/my-companies", authMiddleware, companyController.getAllcompanies);
companyRouter.delete("/my-companies/:id", authMiddleware, companyController.deleteCompany);
companyRouter.get("/:id", authMiddleware, companyController.getdetails);


module.exports = companyRouter; 