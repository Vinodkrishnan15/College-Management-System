const Project = require("../../models/Other/project.model");

const getProject = async (req, res) => {
    try {
        let project = await Project.find(req.body);
        if (!project || project.length === 0) {
            return res
                .status(400)
                .json({ success: false, message: "No Project Available!" });
        }
        res.json({ success: true, message: "Project Found!", project });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const addProject = async (req, res) => {
    try {
        const { student, subject, title, projectUrl, skills } = req.body;
      
        // Handle multiple certification files
        /*const certifications = req.files ? 
            req.files.map(file => ({
                filename: file.filename
            })) : [];
*/
        // Parse skills from JSON string back to array if needed
        const parsedSkills = typeof skills === 'string' ? JSON.parse(skills) : skills;

        const project = await Project.create({
            student,
            projectUrl,
            subject,
            title,
            skills: parsedSkills,
           // certifications
        });

        res.json({
            success: true,
            message: "Project Added!",
            project
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const updateProject = async (req, res) => {
    try {
        const { student, projectUrl, subject, title, skills } = req.body;
        
        // Handle certification updates if files are included
        let updateData = {
            student,
            projectUrl,
            subject,
            title,
            skills: typeof skills === 'string' ? JSON.parse(skills) : skills,
        };

        // If new certifications are uploaded, add them to existing ones
        if (req.files && req.files.length > 0) {
            const project = await Project.findById(req.params.id);
            const newCertifications = req.files.map(file => ({
                filename: file.filename
            }));
            
            updateData.certifications = [
                ...(project.certifications || []),
                ...newCertifications
            ];
        }

        let updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedProject) {
            return res
                .status(400)
                .json({ success: false, message: "No Project Available!" });
        }

        res.json({
            success: true,
            message: "Project Updated!",
            project: updatedProject
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const deleteProject = async (req, res) => {
    try {
        let project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res
                .status(400)
                .json({ success: false, message: "No Project Available!" });
        }

        // Here you might want to also delete the certification files from storage
        // You'll need to implement file deletion logic based on your storage solution

        res.json({
            success: true,
            message: "Project Deleted!",
            project,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// New endpoint to remove specific certifications
const removeCertification = async (req, res) => {
    try {
        const { projectId, certificationId } = req.params;
        
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(400).json({ 
                success: false, 
                message: "Project not found!" 
            });
        }

        // Remove the certification
        project.certifications = project.certifications.filter(
            cert => cert._id.toString() !== certificationId
        );

        await project.save();

        // Here you might want to also delete the certification file from storage
        // Implementation depends on your storage solution

        res.json({
            success: true,
            message: "Certification removed successfully!",
            project
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { 
    getProject, 
    addProject, 
    updateProject, 
    deleteProject,
    removeCertification
}