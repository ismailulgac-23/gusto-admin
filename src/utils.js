
import { SERVER_URL } from "./axios";

export const getImage = (filename)=> {
    return `${SERVER_URL}/uploads/${filename}`;
}