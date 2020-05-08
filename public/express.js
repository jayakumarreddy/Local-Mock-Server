(function() {
  const express = require("express");
  const fs = require("fs");
  const app = express();
  const cors = require("cors");
  const port = 8000;

  const storage_folder = "mocks_folder";

  app.use(cors());
  app.use(express.json());

  app.use("/", (req, res, next) => {
    if (req.originalUrl !== "/allmocks" && req.originalUrl !== "/createmock") {
      const rawData = fs.readFileSync(
        `${__dirname}/${storage_folder}${req.originalUrl}/${req.method}.json`
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
    filesDir.map(fileDir => {
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
    const files = getAllFiles(`${__dirname}/${storage_folder}`);
    const mocks = files.map(file => {
      return {
        ...file,
        reqPath: file.reqPath.replace(`${__dirname}/${storage_folder}`, "")
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

    const folderPath = `${__dirname}/${storage_folder}/${reqPath}`;
    fs.mkdir(folderPath, { recursive: true }, err => {
      if (err) {
        res.status(400).send("error in creating directory");
      }
      fs.writeFile(`${folderPath}/${reqMethod}.json`, fileJSONData, err => {
        if (err) {
          res.status(400).send("error in writing to file");
        }
        const rawData = fs.readFileSync(`${folderPath}/${reqMethod}.json`);
        const jsonData = JSON.parse(rawData);
        res.json(jsonData);
      });
    });
  });

  app.listen(port, () =>
    console.log(`Example app listening at http://localhost:${port}`)
  );
})();
