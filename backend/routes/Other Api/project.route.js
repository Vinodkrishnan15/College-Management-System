const express = require("express");
const router = express.Router();
const { 
    getProject, 
    addProject, 
    updateProject, 
    deleteProject,
    removeCertification 
} = require("../../controllers/Other/project.controller.js");
const upload = require("../../middlewares/multer.middleware.js");

router.post("/getProject", getProject);
router.post("/addProject", upload.array("certification", 5), addProject);
router.put("/updateProject/:id", upload.array("certification", 5), updateProject);
router.delete("/deleteProject/:id", deleteProject);
router.delete("/removeCertification/:projectId/:certificationId", removeCertification);

module.exports = router;