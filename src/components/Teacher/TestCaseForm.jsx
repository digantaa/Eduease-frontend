import React from "react";

const TestCaseForm = ({
  selectedQuestion,
  handleCloseForm,
  submitStatus,
  handleTestCaseSubmit,
  testCase,
  handleTestCaseChange,
  submitting,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4  mb-6">
      <div className="flex justify-between items-center mt-[10vh] mb-4">
        <h2 className="text-xl font-medium text-gray-700">
          Add Test Case for Question #{selectedQuestion.id}
        </h2>
        <button
          onClick={handleCloseForm}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Back to Questions
        </button>
      </div>

      <div className="mb-4 p-4 bg-gray-50 rounded-md">
        <h3 className="font-medium mb-2">Question:</h3>
        <p className="mb-4">{selectedQuestion.question}</p>

        <h3 className="font-medium mb-2">Input Format:</h3>
        <p className="mb-4 text-gray-700">{selectedQuestion.inputFormat}</p>

        <div className="flex gap-4 text-sm text-gray-600">
          <p>
            Difficulty:{" "}
            <span className="capitalize">{selectedQuestion.difficulty}</span>
          </p>
          <p>
            Tags: <span>{selectedQuestion.tags}</span>
          </p>
        </div>
      </div>

      {/* Submit Status Message */}
      {submitStatus && (
        <div
          className={`p-4 mb-4 rounded-md ${
            submitStatus.success
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleTestCaseSubmit}>
        <div className="mb-4">
          <label
            htmlFor="inputData"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Test Case Input*
          </label>
          <textarea
            id="inputData"
            name="inputData"
            value={testCase.inputData}
            onChange={handleTestCaseChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter input for the test case according to the input format..."
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="expectedData"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Expected Output*
          </label>
          <textarea
            id="expectedData"
            name="expectedData"
            value={testCase.expectedData}
            onChange={handleTestCaseChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter the expected output for this test case..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 rounded-md text-white ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? "Submitting..." : "Upload Test Case"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestCaseForm;
