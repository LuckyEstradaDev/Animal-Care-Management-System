import app from "./app.js";
import {ensureDefaultAdmin} from "./services/auth.service.js";

const startServer = async () => {
  try {
    const port = Number(process.env.PORT) || 5000;
    await ensureDefaultAdmin();

    app.listen(port, () => {
      console.log("Listening");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
