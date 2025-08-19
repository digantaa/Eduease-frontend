import axios from "axios";

const STUDENTPROFILEAPI = async (id) => {
   console.log(id + "apicall....");
   try {
      const resp = await axios.get(`https://localhost:7013/api/student/${id}`, {
         withCredentials: true,
      });

      console.log("🚀 ~ STUDENTPROFILEAPI ~ console:", console);
      return resp.data;
   } catch (error) {
      console.log(error);
   }
};

export default STUDENTPROFILEAPI;
