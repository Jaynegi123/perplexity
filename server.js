import "dotenv/config";

import app from "./src/app.js";
import { testAi } from "./src/services/aiservice.js";

app.listen(3000, () => {
    console.log("server is running");
});

testAi();