// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "./media");
//     },
//     filename: function (req, file, cb) {
//         let filename = ""
//         if (req.body?.type === "timetable") {
//             filename = `Timetable_${req.body.semester}_Semester_${req.body.branch}.png`
//         } else if (req.body?.type === "profile") {
//             if (req.body.enrollmentNo) {
//                 filename = `Student_Profile_${req.body.enrollmentNo}_Semester_${req.body.branch}.png`
//             } else {
//                 filename = `Faculty_Profile_${req.body.employeeId}.png`
//             }
//         } else if (req.body?.type === "material") {
//             filename = `${req.body.title}_Subject_${req.body.subject}.pdf`
//         }
//         cb(null, `${filename}`);
//     }
// });

// const upload = multer({ storage: storage });

// module.exports = upload;

// multer.middleware.js
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./media");
    },
    filename: function (req, file, cb) {
        let filename = "";
        
        if (req.body?.type === "timetable") {
            filename = `Timetable_${req.body.semester}_Semester_${req.body.branch}.png`;
        } 
        else if (req.body?.type === "profile") {
            if (req.body.enrollmentNo) {
                filename = `Student_Profile_${req.body.enrollmentNo}_Semester_${req.body.branch}.png`;
            } else {
                filename = `Faculty_Profile_${req.body.employeeId}.png`;
            }
        } 
        else if (req.body?.type === "material") {
            filename = `${req.body.title}_Subject_${req.body.subject}.pdf`;
        }
        else if (req.body?.type === "project") {
            // Handle certification files
            const timestamp = Date.now(); // Add timestamp to ensure unique filenames
            const originalName = path.parse(file.originalname).name;
            const fileExtension = path.extname(file.originalname);
            filename = `certification_${req.body.title}_${originalName}_${timestamp}${fileExtension}`;
        }
        
        cb(null, filename);
    }
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
    if (req.body?.type === "project") {
        // Add allowed certification file types
        const allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
            'application/msword' // .doc
        ];
        
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Allowed types: PDF, JPEG, PNG, DOC, DOCX'), false);
        }
    } else {
        // Handle other file types as before
        cb(null, true);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB file size limit
        files: 5 // Maximum 5 files per upload
    }
});

module.exports = upload;