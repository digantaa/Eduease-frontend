import axios from "axios";
import React from "react";
import { useState } from "react";

const UploadCodingQuestion = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: "",
  });
  const [questionDetail, setQuestionDetail] = useState({
    question: "",
    sampleInput: "",
    expectedOutput: "",
    tags: "",
    difficulty: "medium",
    explanation: "",
    inputFormat: "",
  });

  const difficulties = ["easy", "medium", "hard"];
  const availableTags = [
    "dp",
    "strings",
    "array",
    "math",
    "recursion",
    "trees",
    "stack",
    "heap",
    "priority queue",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuestionDetail({
      ...questionDetail,
      [name]: value,
    });
  };

  const handleTagToggle = (tag) => {
    if (questionDetail.tags.includes(tag)) {
      setQuestionDetail({
        ...questionDetail,
        tags: tag,
      });
    } else {
      setQuestionDetail({
        ...questionDetail,
        tags: tag,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: "" });
    console.log(questionDetail);

    try {
      const response = await axios.post(
        "https://localhost:7013/api/Teacher/upload/codingQuestion",
        questionDetail,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withcredentials: true,
        },
      );

      if (response.ok) {
        const data = await response.json();
        setSubmitStatus({
          success: true,
          message: "Question uploaded successfully!",
        });
        // Reset form after successful submission
        setQuestionDetail({
          question: "",
          sampleInput: "",
          expectedOutput: "",
          tags: [],
          difficulty: "medium",
          explanation: "",
          inputFormat: "",
        });
      } else {
        const errorData = await response.json();
        setSubmitStatus({
          success: false,
          message:
            errorData.message || "Failed to upload question. Please try again.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message:
          "An error occurred while submitting the question. Please check your connection and try again.",
      });
      console.error("Error submitting coding question:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="w-4/5 max-w-4xl mx-auto bg-white rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 p-4">
          Upload Coding Question
        </h1>

        {submitStatus.message && (
          <div
            className={`p-4 mb-6 rounded-md ${submitStatus.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Question */}
            <div>
              <label
                htmlFor="question"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Question*
              </label>
              <textarea
                id="question"
                name="question"
                value={questionDetail.question}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the coding question here..."
              />
            </div>

            {/* Input Format */}
            <div>
              <label
                htmlFor="inputFormat"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Input Format*
              </label>
              <textarea
                id="inputFormat"
                name="inputFormat"
                value={questionDetail.inputFormat}
                onChange={handleInputChange}
                required
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the format of input..."
              />
            </div>

            {/* Sample Input */}
            <div>
              <label
                htmlFor="sampleInput"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Sample Input*
              </label>
              <textarea
                id="sampleInput"
                name="sampleInput"
                value={questionDetail.sampleInput}
                onChange={handleInputChange}
                required
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Provide a sample input..."
              />
            </div>

            {/* Expected Output */}
            <div>
              <label
                htmlFor="expectedOutput"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Expected Output*
              </label>
              <textarea
                id="expectedOutput"
                name="expectedOutput"
                value={questionDetail.expectedOutput}
                onChange={handleInputChange}
                required
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Provide the expected output..."
              />
            </div>

            {/* Explanation */}
            <div>
              <label
                htmlFor="explanation"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Explanation*
              </label>
              <textarea
                id="explanation"
                name="explanation"
                value={questionDetail.explanation}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Explain the solution approach..."
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level*
              </label>
              <div className="flex gap-4">
                {difficulties.map((level) => (
                  <label key={level} className="flex items-center">
                    <input
                      type="radio"
                      name="difficulty"
                      value={level}
                      checked={questionDetail.difficulty === level}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="capitalize">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Select at least one)*
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      questionDetail.tags.includes(tag)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {questionDetail.tags.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  Please select at least one tag
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting || questionDetail.tags.length === 0}
                className={`px-4 py-2 rounded-md text-white ${
                  isSubmitting || questionDetail.tags.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Upload Question"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadCodingQuestion;
