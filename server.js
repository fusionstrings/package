import { serve } from "./deps.js";
import { requestHandler } from "./request-handler.js";

if (import.meta?.main) {
  const timestamp = Date.now();
  const humanReadableDateTime = new Intl.DateTimeFormat("default", {
    dateStyle: "full",
    timeStyle: "long",
  })
    .format(timestamp);

  console.log("Current Date: ", humanReadableDateTime);
  console.info(`Server Listening on http://localhost:8000`);

  await serve(requestHandler, { port: 4242 });
}
