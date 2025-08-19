import axios from "axios";

const TEACHERPROFILE = async (id) => {
    console.log(id + "apicall....");
    try {
        const resp = await axios.get(
            `https://localhost:7013/api/teacher/${id}`,
            { withCredentials: true }
        );

        console.log(resp.data);
        return resp.data;
    } catch (error) {
        console.log(error);
    }
};

export default TEACHERPROFILE;
