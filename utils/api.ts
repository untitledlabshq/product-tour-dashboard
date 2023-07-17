import { API_URL } from "@/constants";
import axios from "axios";

export async function updateTourActive(id: string, value: any, access_token: string) {
  await axios.patch(
    API_URL + "/tour/" + id,
    {
      active: value,
    },
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );
}
