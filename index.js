import express from "express";
import fileUpload from "express-fileupload";
import { downloadFile, getFile, getFiles, uploadFile } from "./s3.js";

const app = express();

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  })
);

app.get("/files", async (req, res) => {
  const result = await getFiles();
  res.json(result.Contents);
});

app.get("/files/:fileName", async (req, res) => {
  const result = await getFile(req.params.fileName);
  res.json({ url: result });
});

app.get("/downloadFile/:fileName", async (req, res) => {
  await downloadFile(req.params.fileName);
  res.json({ message: "image downloaded" });
});

app.post("/files", async (req, res) => {
  const result = await uploadFile(req.files.file);
  res.json({ result });
});

app.use(express.static("images"));

app.listen(3000, () => {
  console.log(`server on port 3000`);
});
