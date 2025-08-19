import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import {
  Play,
  Download,
  Settings,
  Terminal,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CodeEditor = ({ questionId, selectedQuestion }) => {
  const navigate = useNavigate();
  const [code, setCode] = useState(
    selectedQuestion?.submittedCode ||
      `// PLEASE USE SCANNER AND BUFFER READERS
          import java.util.*;
          public class Main {
              public static void main(String[] args) {
                  Scanner scanner = new Scanner(System.in);
                  String name = scanner.nextLine();
                  System.out.println("Hello, " + name + "!");
              }
          }`,
  );
  const [input, setInput] = useState("");
  const [output, setOutput] = useState({
    output: "",
    input: "",
    expectedOutput: "",
    result: false,
  });
  const [outputLoading, setOutputLoading] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [editorOptions, setEditorOptions] = useState({
    fontSize: 20,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    lineNumbers: "on",
    wordWrap: "on",
    scrollbar: {
      vertical: "auto",
      horizontal: "auto",
      useShadows: true,
    },
    padding: { top: 10, bottom: 10 },
    fontFamily: "JetBrains Mono, Consolas, monospace",
    renderLineHighlight: "all",
    smoothScrolling: true,
  });

  // Update code when selectedQuestion changes
  useEffect(() => {
    if (selectedQuestion?.submittedCode) {
      setCode(selectedQuestion.submittedCode);
    }
  }, [selectedQuestion]);

  // Function to download Java file
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "MyJavaCode.java";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleRun = async () => {
    setOutputLoading(true);
    try {
      const resp = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language: "java",
        version: "15.0.2",
        files: [{ content: code }],
        stdin: input,
      });
      console.log(resp.data);
      setOutput({ output: resp.data.run.output });
      setOutputLoading(false);
    } catch (error) {
      console.log(error.message);
      setOutput({ output: `Error: ${error.message}` });
      setOutputLoading(false);
    }
  };

  const handleSubmit = async () => {
    setOutputLoading(true);
    try {
      // Convert current code state to Blob and File object
      const blob = new Blob([code], { type: "text/plain" });
      const file = new File([blob], "MyJavaCode.java", {
        type: "text/plain",
      });

      // Create FormData object
      const formData = new FormData();
      formData.append("file", file);
      formData.append("StudentId", localStorage.getItem("userid"));
      formData.append("CodingQuestionId", questionId);
      formData.append("SubmittedCode", code);
      formData.append("Language", "java");

      // Send the request to the API
      const response = await axios.post(
        "https://localhost:7013/api/Student/submitCode",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      console.log(response.data);
      setOutputLoading(false);
      setOutput(response.data);

      // Update selectedQuestion.submittedCode after successful submission
      if (selectedQuestion) {
        selectedQuestion.submittedCode = code;
      }
    } catch (error) {
      setOutputLoading(false);
      setOutput({
        output: "Error: " + (error.response?.data || error.message),
      });
    }
  };

  // Function to toggle settings visibility
  const toggleSettings = () => {
    setSettingsVisible(!settingsVisible);
  };

  // Function to update editor options
  const updateEditorOptions = (option, value) => {
    setEditorOptions((prevOptions) => ({
      ...prevOptions,
      [option]: value,
    }));
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[#0F1117] text-gray-100">
      {/* Header */}
      {/* <div className="flex items-center justify-between px-6 py-4 bg-[#161B22] border-b border-gray-800">
            <h1 className="text-2xl font-bold flex items-center">
               <span className="text-blue-400 mr-2">Eat</span>
               <span className="text-green-400">Code</span>
            </h1>
            <div className="flex space-x-4">
               <button
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md flex items-center gap-2 transition-colors"
                  onClick={toggleSettings}
               >
                  <Settings size={16} />
                  Settings
               </button>
               <button
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md flex items-center gap-2 transition-colors"
                  onClick={handleDownload}
               >
                  <Download size={16} />
                  Download
               </button>
            </div>
         </div> */}

      <div className="flex h-full flex-col">
        {/* Code Editor Area */}
        <div className="flex flex-col w-full min-h-[65vh]  border-r border-gray-800">
          <div className="px-4 py-2 bg-[#1E2430] border-b border-gray-800 flex justify-between items-center">
            {/* Action Buttons */}

            <div className=" border-gray-800">
              <div className="grid grid-cols-3 gap-3">
                <button
                  className="px-4 bg-gray-800 hover:bg-gray-700 rounded-md flex items-center justify-center gap-2 transition-colors"
                  onClick={handleRun}
                >
                  <Terminal size={12} />
                  <span className="text-xs font-bold text-green-500">
                    Run Code
                  </span>
                </button>
                <button
                  className="px-2 py-2 hover:bg-blue-700 rounded-md flex items-center justify-center gap-2 transition-colors font-medium"
                  onClick={handleSubmit}
                >
                  <Play size={12} fill="green" color="green" />
                  <span className="text-xs  font-bold text-green-500">
                    Submit
                  </span>
                </button>
                <button
                  className="px-2 py-2 hover:bg-blue-700 rounded-md flex items-center justify-center gap-2 transition-colors font-medium"
                  onClick={() => navigate(-1)}
                >
                  <span className="text-xs  font-bold text-green-500">
                    Question List
                  </span>
                </button>
              </div>
            </div>
            <div className="flex gap-4 justify-center items-center">
              <div className="px-3 py-1 text-xs font-medium rounded-md">
                Java
              </div>
              <button
                className="px-4 py-2  hover:bg-gray-700 rounded-md flex items-center gap-2 transition-colors"
                onClick={toggleSettings}
              >
                <Settings size={12} />
                <span className="text-xs">Settings</span>
              </button>
            </div>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="java"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value)}
              options={editorOptions}
              className="w-full"
            />
          </div>
        </div>

        {/* Input/Output Area */}
        <div className="flex h-full justify-centerS bg-[#161B22]">
          {/* Input Section */}
          <div className="p-2 border-b w-[30vw] h-full border-gray-800">
            {/* <div className="flex justify-between items-center mb-2">
                     <h3 className="text-sm font-medium text-gray-400">
                        Input
                     </h3>
                  </div> */}
            <textarea
              className="w-full h-full p-3 bg-[#0D1117] border border-gray-800 rounded-md text-gray-300 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter input for your code..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          {/* Output Section */}
          <div className="flex-1 p-2 w-full h-full overflow-auto">
            {/* <div className="flex justify-between items-center mb-2">
                     <h3 className="text-sm font-medium text-gray-400">
                        Output
                     </h3>
                  </div> */}
            <div className="bg-[#0D1117] border border-gray-800 rounded-md p-4 h-full overflow-auto">
              {outputLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin"></div>
                  <span className="ml-3 text-gray-400">Executing...</span>
                </div>
              ) : (
                <div className="h-full">
                  {output.result !== undefined && (
                    <div className="flex items-center mb-4">
                      <span className="mr-2">Status:</span>
                      {output.result ? (
                        <span className="flex items-center text-green-500">
                          <CheckCircle size={16} className="mr-1" />
                          Passed
                        </span>
                      ) : (
                        <span className="flex items-center text-red-500">
                          <XCircle size={16} className="mr-1" />
                          Failed
                        </span>
                      )}
                    </div>
                  )}

                  {output.input && (
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 mb-1">Input:</div>
                      <div className="bg-[#1E2430] p-2 rounded-md text-white font-mono text-sm">
                        {output.input}
                      </div>
                    </div>
                  )}

                  {output.expectedOutput && (
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 mb-1">
                        Expected Output:
                      </div>
                      <div className="bg-[#1E2430] p-2 rounded-md text-white font-mono text-sm">
                        {output.expectedOutput}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      Your Output:
                    </div>
                    <div className="bg-[#1E2430] p-2 rounded-md text-white font-mono text-sm">
                      {output.output || "No output generated yet"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {settingsVisible && (
        <div
          className="absolute top-0 right-0 w-80 h-full bg-[#161B22] shadow-lg border-l border-gray-800 p-6 overflow-y-auto transition-all"
          style={{ padding: "4px" }}
        >
          <div
            className="flex justify-between items-center mb-6"
            style={{ padding: "4px" }}
          >
            <h2 className="text-xl font-semibold">Editor Settings</h2>
            <button
              className="text-gray-400 hover:text-white"
              onClick={toggleSettings}
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Font Size</label>
              <input
                type="range"
                min="12"
                max="24"
                value={editorOptions.fontSize}
                onChange={(e) =>
                  updateEditorOptions("fontSize", parseInt(e.target.value))
                }
                className="w-full"
              />
              <span className="text-sm text-gray-400">
                {editorOptions.fontSize}px
              </span>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Display Options</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="lineNumbers"
                  checked={editorOptions.lineNumbers === "on"}
                  onChange={(e) =>
                    updateEditorOptions(
                      "lineNumbers",
                      e.target.checked ? "on" : "off",
                    )
                  }
                  className="mr-2"
                />
                <label htmlFor="lineNumbers" className="text-sm">
                  Show Line Numbers
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="wordWrap"
                  checked={editorOptions.wordWrap === "on"}
                  onChange={(e) =>
                    updateEditorOptions(
                      "wordWrap",
                      e.target.checked ? "on" : "off",
                    )
                  }
                  className="mr-2"
                />
                <label htmlFor="wordWrap" className="text-sm">
                  Word Wrap
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="minimap"
                  checked={editorOptions.minimap.enabled}
                  onChange={(e) =>
                    updateEditorOptions("minimap", {
                      enabled: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <label htmlFor="minimap" className="text-sm">
                  Show Minimap
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
