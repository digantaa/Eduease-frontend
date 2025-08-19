import React from "react";

const CodingQuestionList = ({ questions, loading, handleQuestionSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium">
          Select a question to add test cases
        </h2>
      </div>

      {loading ? (
        <div className="p-6 flex justify-center">
          <div className="loader">Loading questions...</div>
        </div>
      ) : questions.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {questions.map((question) => (
            <div
              key={question.id}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleQuestionSelect(question)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Question #{question.id}</h3>
                  <p className="text-gray-800 mt-1 line-clamp-2">
                    {question.question}
                  </p>
                </div>
                <div className="flex items-center text-blue-600">
                  <span>Add Test Cases</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-2 flex gap-3 text-xs text-gray-500">
                <span className="capitalize">
                  Difficulty: {question.difficulty}
                </span>
                {question.tags?.length > 0 && (
                  <span>Tags: {question.tags}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500">
          No coding questions found. Please add some questions first.
        </div>
      )}
    </div>
  );
};

export default CodingQuestionList;
