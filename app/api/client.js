import { create } from "apisauce";

const client = create({
  // baseURL: "https://api.nlpcloud.io/v1/gpu/gpt-j",
  //   baseURL: "https://api.nlpcloud.io/v1/gpt-j",
  baseURL: "https://us-central1-storygenie.cloudfunctions.net/do-magic",
  headers: {
    // Authorization: "Token 7162a650d6fef39cc4b74828215fb8b4efa3d6d3",
    "Content-Type": "application/json",
  },
});

export default client;
