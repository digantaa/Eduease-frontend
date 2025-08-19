import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, X, Bot } from "lucide-react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showChat, setShowChat] = useState(false);
  const chatContainerRef = useRef(null);

  // Auto-scroll the chat window to the latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to send message to the bot
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return; // Prevent sending empty message

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    const query = input;
    setInput("");
    try {
      const response = await axios.post(
        "https://localhost:7013/api/chatbot/ask",
        { Query: query },
        { withCredentials: true },
      );
      console.log(response, "Bot Response..........");
      const botMessage = {
        sender: "bot",
        text: response.data.response || "No response from bot.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      // Show error message in case of a failed request
      const errorMessage = {
        sender: "bot",
        text: error.response
          ? error.response.data.message
          : "Sorry, something went wrong.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <>
      {/* Chat Window */}
      {showChat && (
        <div className="fixed bottom-20 right-6 w-80 border-2 border-gray-900 rounded-lg overflow-hidden bg-white z-50 transition-all duration-300 ease-in-out">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 bg-gray-900 text-white">
            <div className="flex items-center space-x-2">
              <Bot size={24} />
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div
            ref={chatContainerRef}
            className="h-80 overflow-y-auto p-4 bg-gray-50 flex flex-col space-y-3"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`relative max-w-[80%] px-4 py-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-gray-900 text-white"
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  <p className="font-mono text-sm whitespace-pre-wrap">
                    {msg.text}
                  </p>
                  <div
                    className={`absolute top-1/2 -mt-2 w-0 h-0 ${
                      msg.sender === "user"
                        ? "right-0 border-l-8 border-l-gray-900 border-y-8 border-y-transparent -mr-2"
                        : "left-0 border-r-8 border-r-white border-y-8 border-y-transparent -ml-2"
                    }`}
                  ></div>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400 text-sm">
                  Send a message to start chatting...
                </p>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-200">
            <form
              onSubmit={sendMessage}
              className="flex items-center space-x-2 bg-gray-50 rounded-lg border border-gray-200 px-3 py-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-transparent outline-none text-sm font-mono"
              />
              <button
                type="submit"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Chat Toggle Button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-gray-700 hover:text-gray-900 hover:border-2 hover:border-gray-900 z-50"
      >
        <Bot size={24} />
      </button>
    </>
  );
};

export default Chatbot;

// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import {
//    Box,
//    Paper,
//    Typography,
//    IconButton,
//    InputBase,
//    Fade,
//    Fab,
//    createTheme,
//    ThemeProvider,
// } from "@mui/material";
// import {
//    Send as SendIcon,
//    Close as CloseIcon,
//    SmartToy as SmartToyIcon,
// } from "@mui/icons-material";

// // Custom retro theme
// const retroTheme = createTheme({
//    palette: {
//       primary: {
//          main: "#000000",
//       },
//       background: {},
//       text: {
//          primary: "#000000",
//       },
//    },
//    shape: {
//       borderRadius: 0, // Sharp edges for retro look
//    },
//    typography: {
//       fontFamily: 'monospace, "Courier New", Courier', // Retro typewriter font
//    },
// });

// const Chatbot = () => {
//    const [messages, setMessages] = React.useState([]);
//    const [input, setInput] = useState("");
//    const [showChat, setShowChat] = useState(false);
//    const chatContainerRef = useRef(null);

//    // Auto-scroll the chat window to the latest message
//    useEffect(() => {
//       if (chatContainerRef.current) {
//          chatContainerRef.current.scrollTop =
//             chatContainerRef.current.scrollHeight;
//       }
//    }, [messages]);

//    // Function to send message to the bot
//    const sendMessage = async (e) => {
//       e.preventDefault();
//       if (!input.trim()) return; // Prevent sending empty message

//       const userMessage = { sender: "user", text: input };
//       setMessages((prev) => [...prev, userMessage]);
//       const query = input;
//       setInput("");
//       try {
//          const response = await axios.post(
//             "https://localhost:7013/api/chatbot/ask",
//             { Query: query },
//             { withCredentials: true }
//          );
//          console.log(response, "Bot Response..........");
//          const botMessage = {
//             sender: "bot",
//             text: response.data.response || "No response from bot.",
//          };
//          setMessages((prev) => [...prev, botMessage]);
//       } catch (error) {
//          console.error("Error fetching response:", error);
//          // Show error message in case of a failed request
//          const errorMessage = {
//             sender: "bot",
//             text: error.response
//                ? error.response.data.message
//                : "Sorry, something went wrong.",
//          };
//          setMessages((prev) => [...prev, errorMessage]);
//       }
//    };

//    return (
//       <ThemeProvider theme={retroTheme}>
//          <Fade in={showChat}>
//             <Paper
//                elevation={0}
//                sx={{
//                   position: "fixed",
//                   bottom: 70,
//                   right: 20,
//                   width: 300,
//                   border: "2px solid #000",
//                   boxShadow: "4px 4px 0px #000",
//                   display: showChat ? "block" : "none",
//                   bgcolor: "#ffffff",
//                   zIndex: 2900,
//                }}
//             >
//                {/* Header */}
//                <Box
//                   sx={{
//                      display: "flex",
//                      justifyContent: "space-between",
//                      alignItems: "center",
//                      p: 1.5,

//                      color: "white",
//                      borderBottom: "2px solid #000",
//                   }}
//                >
//                   <Typography
//                      variant="subtitle1"
//                      sx={{
//                         fontWeight: "bold",
//                         fontFamily: "monospace",
//                         letterSpacing: 1,
//                      }}
//                   >
//                      CHATBOT_
//                   </Typography>
//                   <IconButton
//                      size="small"
//                      onClick={() => setShowChat(false)}
//                      sx={{
//                         color: "white",
//                         "&:hover": {
//                            bgcolor: "rgba(255, 255, 255, 0.1)",
//                         },
//                      }}
//                   >
//                      <CloseIcon fontSize="small" />
//                   </IconButton>
//                </Box>

//                {/* Messages Area */}
//                <Box
//                   ref={chatContainerRef}
//                   sx={{
//                      height: 300,
//                      overflowY: "auto",
//                      p: 2,
//                      bgcolor: "#ffffff",
//                      borderBottom: "1px solid #000",
//                   }}
//                >
//                   {messages.map((msg, index) => (
//                      <Box
//                         key={index}
//                         sx={{
//                            display: "flex",
//                            justifyContent:
//                               msg.sender === "user" ? "flex-end" : "flex-start",
//                            mb: 1.5,
//                         }}
//                      >
//                         <Paper
//                            elevation={0}
//                            sx={{
//                               maxWidth: "80%",
//                               p: 1.5,
//                               bgcolor: msg.sender === "user" ? "#000" : "#fff",
//                               color: msg.sender === "user" ? "#fff" : "#000",
//                               border: "1px solid #000",
//                               fontFamily: "monospace",
//                               position: "relative",
//                               "&::after":
//                                  msg.sender === "user"
//                                     ? {
//                                          content: '""',
//                                          position: "absolute",
//                                          right: -8,
//                                          top: "50%",
//                                          transform: "translateY(-50%)",
//                                          width: 0,
//                                          height: 0,
//                                          borderTop: "8px solid transparent",
//                                          borderBottom: "8px solid transparent",
//                                          borderLeft: "8px solid #000",
//                                       }
//                                     : {},
//                               "&::before":
//                                  msg.sender === "bot"
//                                     ? {
//                                          content: '""',
//                                          position: "absolute",
//                                          left: -8,
//                                          top: "50%",
//                                          transform: "translateY(-50%)",
//                                          width: 0,
//                                          height: 0,
//                                          borderTop: "8px solid transparent",
//                                          borderBottom: "8px solid transparent",
//                                          borderRight: "8px solid #000",
//                                       }
//                                     : {},
//                            }}
//                         >
//                            <Typography
//                               variant="body2"
//                               sx={{
//                                  fontFamily: "monospace",
//                                  whiteSpace: "pre-wrap",
//                               }}
//                            >
//                               {msg.text}
//                            </Typography>
//                         </Paper>
//                      </Box>
//                   ))}
//                </Box>

//                {/* Input Area */}
//                <Box
//                   sx={{
//                      p: 2,
//                      bgcolor: "white",
//                   }}
//                >
//                   <Paper
//                      component="form"
//                      sx={{
//                         p: "2px 4px",
//                         display: "flex",
//                         alignItems: "center",
//                         border: "1px solid #000",
//                      }}
//                      elevation={0}
//                   >
//                      <InputBase
//                         sx={{
//                            ml: 1,
//                            flex: 1,
//                            fontFamily: "monospace",
//                         }}
//                         placeholder="Type a message..."
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                         onKeyPress={(e) => {
//                            e.key === "Enter" && sendMessage(e);
//                         }}
//                      />
//                      <IconButton
//                         size="small"
//                         onClick={sendMessage}
//                         sx={{
//                            color: "#000",
//                            "&:hover": {
//                               bgcolor: "rgba(0, 0, 0, 0.1)",
//                            },
//                         }}
//                      >
//                         <SendIcon fontSize="small" />
//                      </IconButton>
//                   </Paper>
//                </Box>
//             </Paper>
//          </Fade>

//          {/* Chat Toggle Button */}
//          <Fab
//             onClick={() => setShowChat(!showChat)}
//             sx={{
//                position: "fixed",
//                bottom: 20,
//                right: 20,
//                bgcolor: "#000", // Black background for a bold, retro look
//                color: "#FFF", // White icon
//                borderRadius: "50%", // Circular shape
//                boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.4)", // Subtle shadow for depth
//                width: 70, // Size of the button
//                height: 70, // Same height and width for a perfect circle
//                display: "flex",
//                alignItems: "center",
//                justifyContent: "center",
//                transition: "all 0.3s ease", // Smooth transition
//                fontFamily: "'Press Start 2P', cursive", // Retro pixel font
//                "&:hover": {
//                   bgcolor: "#fff", // Invert colors on hover
//                   color: "#000", // Change icon color on hover
//                   boxShadow: "6px 6px 16px rgba(0, 0, 0, 0.5)", // More prominent shadow on hover
//                   transform: "scale(1.1)", // Slight scale effect
//                },
//             }}
//          >
//             <SmartToyIcon sx={{ fontSize: 30 }} /> {/* White icon */}
//          </Fab>
//       </ThemeProvider>
//    );
// };

// export default Chatbot;

// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import SendIcon from '@mui/icons-material/Send';

// const Chatbot = () => {
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState("");
//     const [showChat, setShowChat] = useState(false);
//     const chatContainerRef = useRef(null);

//     // Auto-scroll the chat window to the latest message
//     useEffect(() => {
//         if (chatContainerRef.current) {
//             chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//         }
//     }, [messages]);

//     // Function to send message to the bot
//     const sendMessage = async () => {
//         if (!input.trim()) return;  // Prevent sending empty message

//         const userMessage = { sender: "user", text: input };
//         setMessages((prev) => [...prev, userMessage]);

//         try {
//             const response = await axios.post("https://localhost:7013/api/chatbot/ask", { Query: input } ,{withCredentials:true});
//             console.log(response, "Bot Response..........");

//             // Check if the response is valid and contains the expected data
//             const botMessage = { sender: "bot", text: response.data.response || "No response from bot." };
//             setMessages((prev) => [...prev, botMessage]);

//         } catch (error) {
//             console.error("Error fetching response:", error);
//             // Show error message in case of a failed request
//             const errorMessage = { sender: "bot", text: error.response ? error.response.data.message : "Sorry, something went wrong." };
//             setMessages((prev) => [...prev, errorMessage]);
//         }

//         setInput("");  // Clear the input field after sending the message
//     };

//     return (
//         <>
//             {/* Chatbot Toggle Button (Bot Icon) */}
//             {showChat ? (
//                 <div
//                     style={{
//                         position: "fixed",
//                         bottom: 70,
//                         right: 20,
//                         width: 300,
//                         border: "2px solid #000",
//                         padding: 10,
//                         borderRadius: 8,
//                         backgroundColor: "#fff",
//                         boxShadow: "4px 4px 0px #000"
//                     }}
//                 >
//                     <div
//                         style={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             alignItems: "center",
//                             marginBottom: 10
//                         }}
//                     >
//                         <strong>Chatbot</strong>
//                         <button
//                             onClick={() => setShowChat(false)}
//                             style={{ cursor: "pointer", border: "none", background: "transparent", fontSize: "16px" }}
//                         >
//                             ❌
//                         </button>
//                     </div>
//                     <div
//                         style={{
//                             height: 200,
//                             overflowY: "auto",
//                             marginBottom: 10
//                         }}
//                         ref={chatContainerRef}
//                     >
//                         {messages.map((msg, index) => (
//                             <div
//                                 key={index}
//                                 style={{ textAlign: msg.sender === "user" ? "right" : "left", marginBottom: 5 }}
//                             >
//                                 <span
//                                     style={{
//                                         background: msg.sender === "user" ? "#ddd" : "#007bff",
//                                         color: msg.sender === "user" ? "#000" : "#fff",
//                                         padding: "5px 10px",
//                                         borderRadius: 8,
//                                         display: "inline-block"
//                                     }}
//                                 >
//                                     {msg.text}
//                                 </span>
//                             </div>
//                         ))}
//                     </div>
//                     <div style={{ display: "flex", alignItems: "center" }}>
//                         <input
//                             type="text"
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             placeholder="Type a message..."
//                             style={{ width: "80%", padding: 5, border: "1px solid #000", borderRadius: 5 }}
//                         />
//                         <button
//                             onClick={sendMessage}
//                             style={{ marginLeft: 5, padding: "5px 10px", cursor: "pointer" }}
//                         >
//                             <SendIcon />
//                         </button>
//                     </div>
//                 </div>
//             ) : (
//                 <div
//                     onClick={() => setShowChat(!showChat)}
//                     style={{
//                         position: "fixed",
//                         bottom: 20,
//                         right: 20,
//                         cursor: "pointer",
//                         backgroundColor: "#007bff",
//                         padding: 10,
//                         borderRadius: "50%",
//                         boxShadow: "4px 4px 0px #000",
//                     }}
//                 >
//                     <img
//                         src="Bot.png"
//                         alt="Chatbot Icon"
//                         width="40"
//                         height="40"
//                     />
//                 </div>
//             )}
//         </>
//     );
// };

// export default Chatbot;
