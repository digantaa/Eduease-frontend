// // import React from "react";

// // const TeacherProfile = ({ teacher }) => {
// //     return (
// //         <div className="card shadow-lg">
// //             <img
// //                 src={`https://localhost:7013/${teacher.image}`}
// //                 alt="Teacher"
// //                 className="card-img-top rounded-circle mx-auto d-block mt-3"
// //                 style={{
// //                     width: "150px",
// //                     height: "150px",
// //                     objectFit: "cover",
// //                 }}
// //             />
// //             <div className="card-body text-center">
// //                 <h5 className="card-title">{teacher.username}</h5>
// //                 <p className="card-text">
// //                     <strong>Email:</strong> {teacher.email}
// //                 </p>
// //                 <p className="card-text">
// //                     <strong>Address:</strong> {teacher.address}
// //                 </p>
// //                 <p className="card-text">
// //                     <strong>Mobile:</strong> {teacher.mobile}
// //                 </p>
// //             </div>
// //         </div>
// //     );
// // };

// // export default TeacherProfile;
// import React from "react";
// import { Card, CardContent, Avatar, Typography, Box } from "@mui/material";
// import { Mail, MapPin, Phone } from "lucide-react";

// const TeacherProfile = ({ teacher }) => {
//    const getInitials = (name) => {
//       return name
//          .split(" ")
//          .map((word) => word[0])
//          .join("")
//          .toUpperCase();
//    };

//    return (
//       <Card
//          sx={{
//             maxWidth: 360,
//             margin: "auto",
//             boxShadow: 3,
//             borderRadius: 2,
//          }}
//       >
//          <Box
//             sx={{
//                display: "flex",
//                flexDirection: "column",
//                alignItems: "center",
//                pt: 3,
//             }}
//          >
//             <Avatar
//                src={`https://localhost:7013/${teacher.image}`}
//                alt={teacher.username}
//                sx={{
//                   width: 128,
//                   height: 128,
//                   mb: 2,
//                   border: "2px solid",
//                   borderColor: "primary.light",
//                }}
//             >
//                {getInitials(teacher.username)}
//             </Avatar>
//             <Typography variant="h5" component="h3" gutterBottom>
//                {teacher.username}
//             </Typography>
//          </Box>

//          <CardContent sx={{ pt: 2 }}>
//             <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                   <Mail size={20} />
//                   <Typography variant="body2" color="text.secondary">
//                      {teacher.email}
//                   </Typography>
//                </Box>

//                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                   <MapPin size={20} />
//                   <Typography variant="body2" color="text.secondary">
//                      {teacher.address}
//                   </Typography>
//                </Box>

//                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                   <Phone size={20} />
//                   <Typography variant="body2" color="text.secondary">
//                      {teacher.mobile}
//                   </Typography>
//                </Box>
//             </Box>
//          </CardContent>
//       </Card>
//    );
// };

// export default TeacherProfile;
