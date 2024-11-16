import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiUpload } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import Heading from "../../components/Heading";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseApiURL } from "../../baseUrl";

const Project = () => {
  const { fullname } = useSelector((state) => state.userData);
  const [subject, setSubject] = useState();
  const [certifications, setCertifications] = useState([]);
  
  // Predefined skills list
  const availableSkills = [
    "JavaScript", "React", "Node.js", "Python", "Java", 
    "HTML/CSS", "Database", "API Development", "AWS",
    "Docker", "Git", "Agile", "UI/UX", "Testing"
  ];

  const [selected, setSelected] = useState({
    title: "",
    projectUrl: "",
    subject: "",
    skills: [],
    student: fullname?.split(" ")[0] + " " + fullname?.split(" ")[2],
  });

  useEffect(() => {
    console.log(fullname,'fullnames');
    toast.loading("Loading Subjects");
    axios
      .get(`${baseApiURL()}/subject/getSubject`)
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          setSubject(response.data.subject);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.message);
      });
  }, []);

  const handleCertificationUpload = (e) => {
    const files = Array.from(e.target.files);
    setCertifications([...certifications, ...files]);
  };

  const removeCertification = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleSkillToggle = (skill) => {
    const updatedSkills = selected.skills.includes(skill)
      ? selected.skills.filter(s => s !== skill)
      : [...selected.skills, skill];
    setSelected({ ...selected, skills: updatedSkills });
  };

  const addProjectHandler = () => {
    toast.loading("Adding Project");
    const formData = new FormData();
    formData.append("title", selected.title);
    formData.append("projectUrl", selected.projectUrl);
    formData.append("subject", selected.subject);
    formData.append("student", selected.student);
    formData.append("skills", JSON.stringify(selected.skills));
    formData.append("type", "project");
    
    /*certifications.forEach((cert, index) => {
      formData.append(`certification${index}`, cert);
    });*/

    axios
      .post(`${baseApiURL()}/project/addProject`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          setSelected({
            title: "",
            projectUrl: "",
            subject: "",
            skills: [],
            faculty: fullname.split(" ")[0] + " " + fullname.split(" ")[2],
          });
          setCertifications([]);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title="Submit Project" />
      </div>
      <div className="w-full flex justify-evenly items-center mt-12">
        <div className="w-1/2 flex flex-col justify-center items-center">
          <div className="w-[80%] mt-2">
            <label htmlFor="title">Project Title</label>
            <input
              type="text"
              id="title"
              className="bg-blue-50 py-2 px-4 w-full mt-1"
              value={selected.title}
              onChange={(e) => setSelected({ ...selected, title: e.target.value })}
            />
          </div>

          <div className="w-[80%] mt-2">
            <label htmlFor="projectUrl">Project URL</label>
            <input
              type="url"
              id="projectUrl"
              className="bg-blue-50 py-2 px-4 w-full mt-1"
              value={selected.projectUrl}
              onChange={(e) => setSelected({ ...selected, projectUrl: e.target.value })}
            />
          </div>

          <div className="w-[80%] mt-2">
            <label htmlFor="subject">Project Subject</label>
            <select
              value={selected.subject}
              name="subject"
              id="subject"
              onChange={(e) => setSelected({ ...selected, subject: e.target.value })}
              className="px-2 bg-blue-50 py-3 rounded-sm text-base accent-blue-700 mt-1 w-full"
            >
              <option value="">-- Select Subject --</option>
              {subject?.map((item) => (
                <option value={item.name} key={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-[80%] mt-4">
            <label>Skills Acquired</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableSkills.map((skill) => (
                <label key={skill} className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded">
                  <input
                    type="checkbox"
                    checked={selected.skills.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                    className="accent-blue-700"
                  />
                  <span>{skill}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="w-[80%] mt-4">
            <label>Certifications</label>
            <label
              htmlFor="certification-upload"
              className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full mt-1 flex justify-center items-center cursor-pointer"
            >
              Upload Certifications
              <span className="ml-2">
                <FiUpload />
              </span>
            </label>
            <input
              type="file"
              id="certification-upload"
              hidden
              multiple
              onChange={handleCertificationUpload}
            />
            <div className="mt-2 space-y-2">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded">
                  <span className="truncate">{cert.name}</span>
                  <button
                    onClick={() => removeCertification(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <AiOutlineClose />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            className="bg-blue-500 text-white mt-8 px-4 py-2 rounded-sm"
            onClick={addProjectHandler}
          >
            Submit Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default Project;