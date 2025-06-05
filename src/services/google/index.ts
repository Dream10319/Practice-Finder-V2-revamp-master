import axios from "axios";

export class GoogleService {
  GoogleAuth = async (token: string) => {
    try {
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { data } = userInfo;
      const payload = {
        email: data.email,
        uid: data.sub,
        firstName: data.given_name,
        lastName: data.family_name,
      };

      return payload;
    } catch (err) {
      throw err;
    }
  };
}
