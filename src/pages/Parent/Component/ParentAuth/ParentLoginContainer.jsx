// // ParentLoginContainer.jsx
// import React, { useState } from "react";
// import ParentLoginForm from "./ParentLoginForm";

// const ParentLoginContainer = () => {
//    const [formData, setFormData] = useState({
//       username: "",
//       password: "",
//       otp: "",
//    });

//    const [errors, setErrors] = useState({});

//    const handleChange = (e) => {
//       setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//       setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
//    };

//    const validate = () => {
//       const newErrors = {};
//       if (!formData.username.trim())
//          newErrors.username = "Username is required.";
//       if (!formData.password) newErrors.password = "Password is required.";
//       if (!formData.otp) newErrors.otp = "OTP is required.";
//       setErrors(newErrors);
//       return Object.keys(newErrors).length === 0;
//    };

//    const handleGetOtp = async () => {
//       if (!formData.username.trim()) {
//          setErrors({ username: "Enter your username to get OTP." });
//          //return;
//       }
//       // Simulate API call
//       const resp = await axios.post(
//          `https://localhost:7013/api/Parent/generateOTP`,
//          { formData },
//          {
//             withCredentials: true,
//             headers: { "Content-Type": "multipart/form-data" },
//          }
//       );

//       console.log(resp);
//    };

//    const handleLogin = () => {
//       if (validate()) {
//          // Simulate login API
//          alert("Logged in successfully!");
//       }
//    };

//    return (
//       <ParentLoginForm
//          username={formData.username}
//          password={formData.password}
//          otp={formData.otp}
//          errors={errors}
//          onChange={handleChange}
//          onGetOtp={handleGetOtp}
//          onLogin={handleLogin}
//       />
//    );
// };

// export default ParentLoginContainer;
