const expressApp = desktopPath => {
  const express = require("express");
  const fs = require("fs");
  const app = express();
  const cors = require("cors");
  const port = 8000;

  const desktopFolder = `mocks_folder`;
  const storage_folder = `${desktopPath}/${desktopFolder}`;

  fs.mkdirSync(storage_folder, { recursive: true });

  app.use(cors());
  app.use(express.json());

  app.use("/", (req, res, next) => {
    if (
      req.originalUrl !== "/allmocks" &&
      req.originalUrl !== "/createmock" &&
      req.originalUrl !== "/deletemock"
    ) {
      const rawData = fs.readFileSync(
        `${storage_folder}${req.originalUrl}/${req.method}.json`
      );
      const jsonData = JSON.parse(rawData);
      const resBody = jsonData.body;
      const resStatus = jsonData.status;
      res.status(resStatus).json(resBody);
    }
    next();
  });

  const getAllFiles = function(dirPath, arrayOfFiles) {
    let filesDir = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];
    filesDir.forEach(fileDir => {
      if (fs.lstatSync(`${dirPath}/${fileDir}`).isDirectory()) {
        getAllFiles(`${dirPath}/${fileDir}`, arrayOfFiles);
      } else {
        // arrayOfFiles.push(`${dirPath}/${fileDir}`);
        arrayOfFiles.push({
          reqPath: `${dirPath}/`,
          reqMethod: fileDir.replace(".json", "")
        });
      }
    });

    return arrayOfFiles;
  };

  app.get("/allmocks", (req, res) => {
    const files = getAllFiles(`${storage_folder}`);
    const mocks = files.map(file => {
      return {
        ...file,
        reqPath: file.reqPath.replace(`${storage_folder}`, "")
      };
    });
    res.status(200).send(mocks);
  });

  app.post("/createmock", (req, res) => {
    const { reqMethod, reqPath, resStatus, resBody } = req.body;
    const fileRawData = {
      status: resStatus,
      body: resBody
    };
    const fileJSONData = JSON.stringify(fileRawData, null, 2);

    const folderPath = `${storage_folder}/${reqPath}`;
    fs.mkdir(folderPath, { recursive: true }, err => {
      if (err) {
        res.status(400).send(`Error in creating directory ${err}`);
      } else {
        fs.writeFile(`${folderPath}/${reqMethod}.json`, fileJSONData, err => {
          if (err) {
            res.status(400).send(`Error in writing to file ${err}`);
          } else {
            const rawData = fs.readFileSync(`${folderPath}/${reqMethod}.json`);
            const jsonData = JSON.parse(rawData);
            res.json(jsonData);
          }
        });
      }
    });
  });

  app.delete("/deletemock", (req, res) => {
    const { reqMethod, reqPath } = req.body;

    const filePath = `${storage_folder}/${reqPath}/${reqMethod}.json`;

    try {
      fs.unlinkSync(filePath);
      res.status(200).json({ success: "file Deleted" });
    } catch (err) {
      res.status(400).send(`Error in deleting file ${err}`);
    }
  });

  app.listen(port, () =>
    console.log(`Example app listening at http://localhost:${port}`)
  );
};
module.exports = { expressApp };
