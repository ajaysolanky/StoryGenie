import * as Application from "expo-application";

let userId;
export async function setUserIdAsync() {
  const uid = Application.androidId;
  userId = uid;
  return uid;
}

export default function getUserId() {
  return userId;
}
