import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const submitLead = async (payload) => {
  const res = await axios.post(`${API}/leads`, payload);
  return res.data;
};

export const WHATSAPP_NUMBER = "919580261255"; // +91 9580261255
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
