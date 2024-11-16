import React, { useState } from "react";
import toast from "react-hot-toast";
import Heading from "../../components/Heading";
import axios from "axios";
import { baseApiURL } from "../../baseUrl";
import { FiSearch, FiLink, FiAward } from "react-icons/fi";

const Student = () => {
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState([]);
  const [data, setData] = useState({
    enrollmentNo: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    semester: "",
    branch: "",
    gender: "",
    profile: "",
  });
  const [id, setId] = useState();

  const searchStudentHandler = (e) => {
    e.preventDefault();
    setId("");
    setProjects([]);
    setData({
      enrollmentNo: "",
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      semester: "",
      branch: "",
      gender: "",
      profile: "",
    });
    
    toast.loading("Getting Student");
    const headers = {
      "Content-Type": "application/json",
    };
    
    axios
      .post(
        `${baseApiURL()}/student/details/getDetails`,
        { enrollmentNo: search },
        { headers }
      )
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          if (response.data.user.length === 0) {
            toast.error("No Student Found!");
          } else {
            toast.success(response.data.message);
            const userData = response.data.user[0];
            setData({
              enrollmentNo: userData.enrollmentNo,
              firstName: userData.firstName,
              middleName: userData.middleName,
              lastName: userData.lastName,
              email: userData.email,
              phoneNumber: userData.phoneNumber,
              semester: userData.semester,
              branch: userData.branch,
              gender: userData.gender,
              profile: userData.profile,
            });
            setId(userData._id);
            // Get projects after setting user data
            getProjects(`${userData.firstName} ${userData.lastName}`);
          }
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response.data.message);
        console.error(error);
      });
  };

  const getProjects = (studentName) => {
    toast.loading("Fetching Projects");
    const headers = {
      "Content-Type": "application/json",
    };
    
    axios
      .post(
        `${baseApiURL()}/project/getProject`,
        { student: studentName }, // Using faculty field as it stores the student name
        { headers }
      )
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          setProjects(response.data.project);
          if (response.data.project.length === 0) {
            toast.error("No projects found for this student");
          } else {
            toast.success("Projects loaded successfully");
          }
        } else {
          toast.error("Failed to load projects");
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error("Error loading projects");
        console.error(error);
      });
  };

  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title="Student Details" />
      </div>
      <div className="my-6 mx-auto w-full">
        <form
          className="flex justify-center items-center border-2 border-blue-500 rounded w-[40%] mx-auto"
          onSubmit={searchStudentHandler}
        >
          <input
            type="text"
            className="px-6 py-3 w-full outline-none"
            placeholder="Enrollment No."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="px-4 text-2xl hover:text-blue-500" type="submit">
            <FiSearch />
          </button>
        </form>
        
        {id && (
          <>
            <div className="mx-auto w-full bg-blue-50 mt-10 flex justify-between items-center p-10 rounded-md shadow-md">
              <div>
                <p className="text-2xl font-semibold">
                  {data.firstName} {data.middleName} {data.lastName}
                </p>
                <div className="mt-3">
                  <p className="text-lg font-normal mb-2">
                    Enrollment No: {data.enrollmentNo}
                  </p>
                  <p className="text-lg font-normal mb-2">
                    Phone Number: +91 {data.phoneNumber}
                  </p>
                  <p className="text-lg font-normal mb-2">
                    Email Address: {data.email}
                  </p>
                  <p className="text-lg font-normal mb-2">
                    Branch: {data.branch}
                  </p>
                  <p className="text-lg font-normal mb-2">
                    Semester: {data.semester}
                  </p>
                </div>
              </div>
              <img
                src={process.env.REACT_APP_MEDIA_LINK + "/" + data.profile}
                alt="student profile"
                className="h-[200px] w-[200px] object-cover rounded-lg shadow-md"
              />
            </div>

            {/* Projects Section */}
            <div className="w-full mt-8">
              <h2 className="text-2xl font-semibold mb-4">Student Projects</h2>
              {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project, index) => (
                    <div
                      key={index}
                      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      <p className="text-gray-600 mb-4">Subject: {project.subject}</p>
                      
                      {/* Project URL */}
                      <div className="flex items-center mb-3">
                        <FiLink className="mr-2 text-blue-500" />
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 underline"
                        >
                          Project Link
                        </a>
                      </div>

                      {/* Skills */}
                      {project.skills && project.skills.length > 0 && (
                        <div className="mb-4">
                          <p className="font-medium mb-2">Skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {project.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Certifications */}
                      {project.certifications && project.certifications.length > 0 && (
                        <div className="mt-4">
                          <p className="font-medium mb-2">Certifications:</p>
                          <div className="space-y-2">
                            {project.certifications.map((cert, idx) => (
                              <div key={idx} className="flex items-center">
                                <FiAward className="mr-2 text-green-500" />
                                <a
                                  href={`${process.env.REACT_APP_MEDIA_LINK}/${cert.filename}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-green-600 hover:text-green-800 underline"
                                >
                                  View Certificate {idx + 1}
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No projects found for this student.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Student;