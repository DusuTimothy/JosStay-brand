import { createApp } from "./index.js";
import { env } from "./env.js";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`JosStay API listening on http://localhost:${env.PORT}/health`);
});
