import React, { useEffect, useState } from "react";
import { HeadderNavigation } from "./Header";
import { QueryInputBox } from "./QueryInputBox";
import { DataGrid } from "./DataGrid";
import { Box } from "@mui/material";
import { DUMMY_URL } from "../API/constents";
import axios from "axios";
import { dataGridStore } from "../store/DataGrid.store";

function LandingPage() {
  const [columnHeader, setColumnHeader] = useState();
  const [rowsData, setRowsData] = useState();
  const [defaultColoumnWidth, setDefaultColoumnWidth] = useState()
  const [isDragDropEnable, setIsDragDropEnable] = useState (false)
  const { setSummaryData, isLoading, setIsLoading, setColumnOrdersData, setEditHeaderStatus } =
    dataGridStore((state) => state);

  useEffect(() => {
    axios
      .get(DUMMY_URL)
      .then((response) => {
        const properties = response.data.entries[0];
        let keyNames = Object.keys(properties);
        const objArray = [...keyNames];
        setColumnOrdersData(keyNames);
        setRowsData(response.data.entries);
        const result = objArray.map((item) => ({ name: item, title: item }));
        const summaryData =  objArray.map((item) => ({ name: item, disable: false }));
        setSummaryData(summaryData)
        const coloumnWidth = objArray.map((item) => ({columnName: item, width: 180 }))
        setDefaultColoumnWidth(coloumnWidth)
        setColumnHeader(result);
        setIsLoading(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleEditColumnHeader = (data) => {
    setColumnHeader(data);
    const headerValue = data.map((item) => {
      return item.name;
    });
    const coloumnWidth = data.map((item) => ({columnName: item, width: 180 }))
    setDefaultColoumnWidth(coloumnWidth)
    setColumnOrdersData(headerValue);
    setEditHeaderStatus(false);
  };

const handleDragDrop = (value) => {
  setIsDragDropEnable(true)
  console.log (value)
}

  return (
    <div>
      <HeadderNavigation />
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "start",
            marginTop: "40px",
            background: "#f5f5f5",
            minHeight: "100vh",
            width: "100%",
          }}
          mt={5}
        >
          <QueryInputBox />
          <DataGrid
            rowsData={rowsData}
            columnHeadersData={columnHeader}
            handleEditColumnHeader={handleEditColumnHeader}
            defaultColoumnWidth = {defaultColoumnWidth}
            handleDragDrop = {handleDragDrop}
          />
        </Box>
      )}
    </div>
  );
}

export { LandingPage };
