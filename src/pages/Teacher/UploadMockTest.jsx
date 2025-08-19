import axios from "axios";
import React, { useState } from "react";
import { Upload, CheckCircle, Trash2, AlertTriangle } from "lucide-react";

export default function UploadMockTest() {
  const [mockTestDetails, setMockTestDetails] = useState({
    year: "1",
    subject: "",
    teacherId: localStorage.getItem("userid") || "",
    teacherName: localStorage.getItem("username"),
    duration: "",
    totalMarks: "",
  });

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMockTestDetails({ ...mockTestDetails, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFileError("");

    if (selectedFile) {
      if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
        setFileError("Only CSV files are allowed");
        setFile(null);
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        setFileError("File size exceeds the limit (5MB)");
        setFile(null);
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setFileError("Please select a CSV file");
      return;
    }

    if (!mockTestDetails.subject) {
      setSubmitStatus({ type: "error", message: "Subject is required" });
      return;
    }

    if (!mockTestDetails.duration) {
      setSubmitStatus({ type: "error", message: "Duration is required" });
      return;
    }

    if (!mockTestDetails.totalMarks) {
      setSubmitStatus({ type: "error", message: "Total marks is required" });
      return;
    }

    const formData = new FormData();
    formData.append("year", Number(mockTestDetails.year));
    formData.append("subject", mockTestDetails.subject);
    formData.append("teacherId", mockTestDetails.teacherId);
    formData.append("teacherName", mockTestDetails.teacherName);
    formData.append("duration", Number(mockTestDetails.duration));
    formData.append("totalMarks", Number(mockTestDetails.totalMarks));
    formData.append("CSV", file);

    setIsLoading(true);
    setSubmitStatus({ type: "", message: "" });

    console.log(formData);
    try {
      const resp = await axios.post(
        "https://localhost:7013/api/Teacher/upload/test",
        formData,
        { withCredentials: true },
      );
      setSubmitStatus({
        type: "success",
        message: "Test uploaded and assigned successfully!",
      });
      // Reset form
      setMockTestDetails({
        year: "1",
        subject: "",
        teacherId: localStorage.getItem("userid") || "",
        teacherName: "",
        duration: "",
        totalMarks: "",
      });
      setFile(null);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Upload failed";
      setSubmitStatus({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileError("");
  };

  const yearOptions = [1, 2, 3, 4, 5];
  const subjectOptions = [
    "Mathematics",
    "English",
    "Science",
    "History",
    "Geography",
    "Computer Science",
    "Physics",
    "Chemistry",
    "Biology",
    "Economics",
  ];

  return (
    <div className="flex flex-col items-center p-4 max-w-4xl mx-auto min-h-[100vh]">
      <div className="w-full bg-white rounded-lg shadow-lg p-4 mb-4">
        <div className="flex items-center mb-4">
          <Upload className="w-8 h-8 text-blue-600 mr-4" />
          <h1 className="text-2xl font-bold text-gray-800">Upload Mock Test</h1>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Year Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Year Level
              </label>
              <select
                name="year"
                value={mockTestDetails.year}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    Year {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <select
                name="subject"
                value={mockTestDetails.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Subject</option>
                {subjectOptions.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="duration"
                value={mockTestDetails.duration}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Total Marks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Marks <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="totalMarks"
                value={mockTestDetails.totalMarks}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload CSV File <span className="text-red-500">*</span>
            </label>

            {!file ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-gray-700 font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    CSV file (max 5MB)
                  </p>
                </label>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {Math.round(file.size / 1024)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            )}

            {fileError && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" /> {fileError}
              </p>
            )}
          </div>

          {/* Status Message */}
          {submitStatus.message && (
            <div
              className={`p-4 rounded-md ${
                submitStatus.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              <div className="flex">
                {submitStatus.type === "success" ? (
                  <CheckCircle className="w-5 h-5 mr-2" />
                ) : (
                  <AlertTriangle className="w-5 h-5 mr-2" />
                )}
                <p>{submitStatus.message}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 transition-colors"
              }`}
            >
              {isLoading ? "Uploading..." : "Upload Mock Test"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
