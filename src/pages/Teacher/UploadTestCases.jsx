import React, { useEffect, useState } from "react";
import axios from "axios";
import TestCaseForm from "../../components/Teacher/TestCaseForm";
import CodingQuestionList from "../../components/Teacher/CodingQuestionsList";

const UploadTestCases = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [testCase, setTestCase] = useState({
    codingQuestionId: 0,
    inputData: "",
    expectedData: "",
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all coding questions
  const fetchAllQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://localhost:7013/api/Teacher/getCodingQuestions",
      );
      setQuestions(response.data);
      setError(null);
    } catch (e) {
      console.error("Error fetching questions:", e);
      setError("Failed to load coding questions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle selecting a question to add test cases
  const handleQuestionSelect = (question) => {
    setSelectedQuestion(question);
    setTestCase({
      codingQuestionId: question.id,
      inputData: "",
      expectedData: "",
    });
    setSubmitStatus(null);
  };

  // Handle input changes for test case fields
  const handleTestCaseChange = (e) => {
    const { name, value } = e.target;
    setTestCase({
      ...testCase,
      [name]: value,
    });
  };

  // Handle test case submission
  const handleTestCaseSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post(
        "https://localhost:7013/api/Teacher/upload/testCases",
        testCase,
      );

      setSubmitStatus({
        success: true,
        message: "Test case uploaded successfully!",
      });

      // Reset form fields but keep the selected question
      setTestCase({
        codingQuestionId: selectedQuestion.id,
        inputData: "",
        expectedData: "",
      });
    } catch (error) {
      console.error("Error submitting test case:", error);
      setSubmitStatus({
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to upload test case. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Close the test case form
  const handleCloseForm = () => {
    setSelectedQuestion(null);
    setTestCase({
      codingQuestionId: 0,
      inputData: "",
      expectedData: "",
    });
    setSubmitStatus(null);
  };

  useEffect(() => {
    fetchAllQuestions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-4/5 max-w-4xl mx-auto">
        {/* <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Upload Test Cases
        </h1> */}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
            {error}
            <button
              className="ml-4 underline text-red-600"
              onClick={fetchAllQuestions}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Test Case Form */}
        {selectedQuestion ? (
          <TestCaseForm
            selectedQuestion={selectedQuestion}
            handleCloseForm={handleCloseForm}
            submitStatus={submitStatus}
            handleTestCaseSubmit={handleTestCaseSubmit}
            testCase={testCase}
            handleTestCaseChange={handleTestCaseChange}
            submitting={submitting}
          />
        ) : (
          // Questions List
          <CodingQuestionList
            questions={questions}
            loading={loading}
            handleQuestionSelect={handleQuestionSelect}
          />
        )}
      </div>
    </div>
  );
};

export default UploadTestCases;
