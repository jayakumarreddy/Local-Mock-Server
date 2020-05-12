import React, { useEffect, useState } from "react";
import Sheet from "../../components/Sheet";
import Label from "../../components/Label";
import Button from "../../components/Button";
import AppIcon from "../../images/AppIcon.png";
import deleteIcon from "../../images/delete.png";

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
  const [createMockState, setCreateMockState] = useState({
    successMessage: "",
    errorMessage: "",
    isLoading: false
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
    setCreateMockState({
      successMessage: "",
      errorMessage: "",
      isLoading: true
    });
    const response = await fetch("http://localhost:8000/createmock", {
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
    if (response.ok) {
      setCreateMockState({
        successMessage: "Create/Update Mock is success",
        errorMessage: "",
        isLoading: false
      });
    } else {
      setCreateMockState({
        successMessage: "",
        errorMessage: "Something went Wrong!!",
        isLoading: false
      });
    }
    fetchMocks();
  };

  const onMockClick = async mock => {
    setCreateMockState({
      successMessage: "",
      errorMessage: "",
      isLoading: false
    });
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

  const onDeleteClick = async (e, { reqMethod, reqPath }) => {
    e.stopPropagation();
    console.log("on delete click", mock);
    const response = await fetch("http://localhost:8000/deletemock", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        reqMethod,
        reqPath
      })
    });
    if (response.ok) {
      fetchMocks();
    }
  };

  const onButtonClick = () => {
    setMock({ reqMethod: "", reqPath: "", resStatus: "", resBody: "" });
  };

  return (
    <div className="home-page">
      <div className="left-wrapper">
        <div className="left-wrapper-inner">
          <div className="header-title">
            <img src={AppIcon} alt="" />
            <Label fontSize={"32px"} color={"white"}>
              Mock Api’s
            </Label>
          </div>

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
                  <div>
                    <span className={`left-wrapper-mock-${mock.reqMethod}`}>
                      {mock.reqMethod}
                    </span>
                    <span>{mock.reqPath}</span>
                  </div>
                  <img
                    src={deleteIcon}
                    alt="x"
                    onClick={e => onDeleteClick(e, mock)}
                  />
                </Sheet>
              );
            })}
          </div>
          <div className="left-wrapper-button">
            <Button onClick={onButtonClick}>CREATE NEW MOCK API</Button>
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
            createMockState={createMockState}
            setCreateMockState={setCreateMockState}
          ></ReqForm>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
