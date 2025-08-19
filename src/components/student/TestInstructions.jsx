import React from "react";

const TestInstructions = ({ duration, marks, onClose, onStartTest }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl"
        >
          ✖
        </button>

        {/* Instructions Content */}
        <h2 className="text-2xl font-semibold mb-4">Test Instructions</h2>
        <p>
          <strong>Duration:</strong> {duration} minutes
        </p>
        <p>
          <strong>Marks:</strong> {marks}
        </p>
        <ul className="list-disc list-inside mt-4">
          <li>Do not close the tab during the test.</li>
          <li>Ensure a stable internet connection.</li>
          <li>Once started, the test cannot be paused.</li>
        </ul>

        {/* Start Test Button */}
        <button
          onClick={onStartTest}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full"
        >
          Start Test
        </button>
      </div>
    </div>
  );
};

export default TestInstructions;
