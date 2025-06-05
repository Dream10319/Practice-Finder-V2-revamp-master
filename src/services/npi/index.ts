import axios from "axios";

export class NPIService {
  validateNPI = async (npi: string) => {
    try {
      const response = await axios.get(
        `https://npiregistry.cms.hhs.gov/api/?version=2.1&number=${npi}`,
        {
          headers: {
            Origin: "*",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "Content-Type",
          },
        }
      );

      return response.data.result_count > 0;
    } catch (err) {
      throw err;
    }
  };
}
