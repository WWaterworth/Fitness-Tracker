// THIS IS WHERE YOUR CLIENT SIDE API CODE LIVES
const { REACT_API_URL = "https://fitnesstrac-kr.herokuapp.com/api" } =
  process.env;

export const callApi = async ({ url, method = "GET", token, body }) => {
  try {
    const options = {
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }
    const resp = await fetch(REACT_API_URL + url, options);
    const data = await resp.json();
    if (data.error) {
      throw data.error;
    }
    return data;
  } catch (error) {
    console.error(error);
  }
};
