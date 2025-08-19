import axios from "axios";
import React, { useEffect } from "react";
import TestCard from "./TestCard";

const MockTests = () => {
   const [testData, setTestData] = React.useState([]);
   const userid = localStorage.getItem("userid");

   const fetchTestList = async () => {
      const resp = await axios(
         `https://localhost:7013/api/Student/getTestList?StudentId=${userid}&year=1
`,
         { withCredentials: true }
      );
      console.log("🚀 ~ fetchTestList ~ resp:", resp.data.data);
      setTestData(resp.data.data);
   };

   useEffect(() => {
      fetchTestList();
   }, []);

   return (
      <div className="grid grid-cols-3 gap-4  place-items-center">
         {testData.map((test) => (
            <TestCard key={test.testId} test={test} />
         ))}
      </div>
   );
};

export default MockTests;
