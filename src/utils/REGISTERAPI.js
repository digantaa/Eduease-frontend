import axios from "axios";

const REGISTERAPI = async (formData) => {
    console.log(formData);
    // eslint-disable-next-line no-useless-catch
    try {
        const resp = await axios.post(
            "https://localhost:7013/api/Auth/Register",
            formData,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return resp;
    } catch (error) {
        throw error;
    }
};

export default REGISTERAPI;
