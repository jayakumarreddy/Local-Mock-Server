import React, { useEffect, useState } from "react";
import Sheet from "../../components/Sheet";
import Label from "../../components/Label";
import ReqForm from "../ReqForm";

import "./HomePage.css";

const HomePage = () => {
  const [mocks, setMocks] = useState([]);
  const [mock, setMock] = useState({
    reqMethod: "",
    reqPath: "",
    resStatus: "",
    resBody: ""
  });

  const fetchMocks = async () => {
    let response = await fetch("http://localhost:8000/allmocks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    let result = await response.json();
    setMocks(result);
  };

  useEffect(() => {
    fetchMocks();
  }, []);

  const onsubmit = async ({ reqMethod, reqPath, resStatus, resBody }) => {
    console.log("form submitted", reqMethod, reqPath, resStatus, resBody);
    await fetch("http://localhost:8000/createmock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        reqMethod,
        reqPath,
        resStatus,
        resBody: JSON.parse(resBody)
      })
    });
    fetchMocks();
  };

  const onMockClick = async mock => {
    console.log("mock clicked", mock);
    let response = await fetch(`http://localhost:8000/${mock.reqPath}`, {
      method: `${mock.reqMethod}`,
      headers: {
        "Content-Type": "application/json"
      }
    });
    let result = await response.json();
    setMock({
      reqMethod: mock.reqMethod,
      reqPath: mock.reqPath,
      resStatus: response.status,
      resBody: JSON.stringify(result, null, 2)
    });
  };

  return (
    <div className="home-page">
      <div className="left-wrapper">
        <div className="left-wrapper-inner">
          <Label fontSize={"38px"} color={"white"}>
            Mock Api’s
          </Label>
          <div className="left-wrapper-mocks">
            {(mocks || []).length <= 0 && (
              <Sheet className="left-wrapper-no-mock left-wrapper-mock">
                No Mocks Present.
              </Sheet>
            )}
            {(mocks || []).map(mock => {
              return (
                <Sheet
                  className="left-wrapper-mock"
                  onClick={() => onMockClick(mock)}
                  key={`${mock.reqPath}${mock.resStatus}`}
                >
                  <span className={`left-wrapper-mock-${mock.reqMethod}`}>
                    {mock.reqMethod}
                  </span>
                  <span>{mock.reqPath}</span>
                </Sheet>
              );
            })}
          </div>
        </div>
      </div>
      <div className="right-wrapper">
        <div className="right-wrapper-inner">
          <ReqForm
            onsubmit={onsubmit}
            reqMethodProp={mock.reqMethod}
            reqPathProp={mock.reqPath}
            resStatusProp={mock.resStatus}
            resBodyProp={mock.resBody}
          ></ReqForm>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
