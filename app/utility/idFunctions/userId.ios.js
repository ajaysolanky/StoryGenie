import * as Application from "expo-application";
import uuidv5 from "uuid/v5";

let userId;
const UUID_NAMESPACE = "29cc8a0d-747c-5f85-9ff9-f2f16636d963"; // uuidv5(0, "expo")

export async function setUserIdAsync() {
  if (userId) {
    return userId;
  }

  const identifierForVendor = await Application.getIosIdForVendorAsync();
  const bundleIdentifier = Application.applicationId;

  // It's unlikely identifierForVendor will be null (it returns null if the
  // device has been restarted but not yet unlocked), but let's handle this
  // case.
  if (identifierForVendor) {
    userId = uuidv5(
      `${bundleIdentifier}-${identifierForVendor}`,
      UUID_NAMESPACE
    );
  } else {
    const installationTime = await Application.getInstallationTimeAsync();
    userId = uuidv5(
      `${bundleIdentifier}-${installationTime.getTime()}`,
      UUID_NAMESPACE
    );
  }

  return userId;
}

export default function getUserId() {
  return userId;
}
