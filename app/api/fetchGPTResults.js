import client from "./client";
import * as actionTypes from "../store/actions";

const RETRY_DELAY = 1000;

// const gptDefaults = {
//   length_no_input: true,
//   remove_input: true,
//   //   repetition_penalty: 1.2,
// };

//https://www.helloforefront.com/pricing

// retry logic
const fetchGPTResults = async ({ text, args, num_retries = 1 }) => {
  const generated_text = "Dil lena khel hai dildar ka.".repeat(10);
  //   return {
  //     ok: true,
  //     generated_text: generated_text,
  //     nb_generated_tokens: 10,
  //   };

  console.log(text, args);

  let retries = num_retries;

  while (retries > 0) {
    if (retries < num_retries) {
      console.log("GPT RETRY!");
    }
    retries = retries - 1;
    const response = await client.post("", {
      text: text,
      ...args,
      // ...gptDefaults,
    });
    console.log("OK? %s", response.ok);
    console.log("Response %s", response.data);

    if (response.ok || retries === 0) {
      return {
        ok: response.ok,
        nb_generated_tokens: response.data.nb_generated_tokens,
        generated_text: response.data.generated_text
          ?.trimEnd()
          .replace("�", `"`),
        // .replace(/[^a-zA-Z ]/g, ""),
        //   .replace(/[^\x00-\x7F]/g, " "),
      }; //fields: ok, generated_text, nb_generated_tokens
    }
    setTimeout(() => {}, RETRY_DELAY);
  }
};

export default {
  fetchGPTResults,
};
