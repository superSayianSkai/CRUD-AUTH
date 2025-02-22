const { default: helmet } = require("helmet");

const object = {
  start: "node --env-file=.env index.js",
  dev: "node --watch --trace-warnings --env-file=.env index.js",
};

app.use(cors()) -
  "this helps configure cors for the backend without necessary building it from scratch";
app.use(helmet()) -
  "this helps set a protective layer on the web application by setting various http headers ";
  "its a node js middleware"
