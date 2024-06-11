import app from "./app";
import chalk from "chalk";
import config from "./config/index";
import initialize from "./config/db";



initialize();

app.listen(config.port, () => {
  console.log(
    `${chalk.blue(
      `Blogd Api Running on ${config.baseUrl}:${config.port}`
    )}`
  );
});
