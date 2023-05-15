import axios from "axios";
import { KEYS, getItemInStorage, notify, strigaConfig } from "lib/utils";

export const fetchUser = async () => {
  try {
    const userData = getItemInStorage(KEYS.tokenStorage);
    const token = userData ? userData?.token : "";

    if (!token) return;

    const response = await axios.get(`${strigaConfig.baseUrl}/user`, {
      headers: {
        "x-authorization": token,
      },
    });
    return response?.data;
  } catch (err: any) {
    console.log("ERROR", err);
    throw err;
  }
};
