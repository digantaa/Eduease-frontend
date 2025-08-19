import axios from "axios";

const ALLTEACHERSAPI = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
        const resp = await axios.get(
            "https://localhost:7013/api/student/allteachers",
            { withCredentials: true }
        );

        return resp.data;
    } catch (error) {
        throw error;
    }
};

export default ALLTEACHERSAPI;
