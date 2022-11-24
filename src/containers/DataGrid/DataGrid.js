import React, { useRef, useCallback, useState } from "react";
import Paper from "@mui/material/Paper";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableColumnReordering,
  DragDropProvider,
  Toolbar,
  ExportPanel,
  PagingPanel,
  TableFilterRow,
  TableColumnResizing,
} from "@devexpress/dx-react-grid-material-ui";
import saveAs from "file-saver";
import { GridExporter } from "@devexpress/dx-react-grid-export";
import { PagingState, IntegratedPaging } from "@devexpress/dx-react-grid";
import { SearchState, IntegratedFiltering } from "@devexpress/dx-react-grid";
import {
  SortingState,
  IntegratedSorting,
  FilteringState,
} from "@devexpress/dx-react-grid";
import { EditingState } from "@devexpress/dx-react-grid";
import { Button, Stack } from "@mui/material";
import { dataGridStore } from "../../store/DataGrid.store";
import { ConfirmationModal } from "../../components/Modal/Modal";

//Export excel documents function
const onSave = (workbook) => {
  workbook.xlsx.writeBuffer().then((buffer) => {
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      "DataGrid.xlsx"
    );
  });
};

//Excel header design function
const customizeHeader = (worksheet) => {
  const generalStyles = {
    font: { bold: true },
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "D3D3D3" },
      bgColor: { argb: "D3D3D3" },
    },
  };

  for (let rowIndex = 1; rowIndex < 6; rowIndex += 1) {
    worksheet.mergeCells(rowIndex, 1, rowIndex, 7);

    Object.assign(worksheet.getRow(rowIndex).getCell(7), generalStyles);
  }
  worksheet.getRow(1).height = 20;
  worksheet.getRow(1).getCell(1).font = { bold: true, size: 16 };
  worksheet.getRow(1).getCell(2).numFmt = "d mmmm yyyy";
  worksheet.getRow(1).getCell(2).font = { bold: true, size: 16 };
  worksheet.getColumn(1).values = [
    "Sale Amounts:",
    "Company Name:",
    "Address:",
    "Phone:",
    "Website:",
  ];
};

const priorityWeights = {
  Low: 0,
  Normal: 1,
  High: 2,
};

const comparePriority = (a, b) => {
  const priorityA = priorityWeights[a];
  const priorityB = priorityWeights[b];
  if (priorityA === priorityB) {
    return 0;
  }
  return priorityA < priorityB ? -1 : 1;
};

function DataGrid({ rowsData, columnHeadersData, handleEditColumnHeader }) {
  const exporterRef = useRef(null);
  const {
    setEditHeaderStatus,
    editHeaderStatus,
    columnOrdersData,
    setColumnOrdersData,
  } = dataGridStore((state) => state);

  const [integratedSortingColumnExtensions] = useState([
    { columnName: "priority", compare: comparePriority },
  ]);

  const startExport = useCallback(() => {
    exporterRef.current.exportGrid();
  }, [exporterRef]);

  const handleEditHeader = () => {
    setEditHeaderStatus(true);
  };

  const handleColumnHeader = (data) => {
    handleEditColumnHeader(data);
  };

  return (
    <Paper
      style={{
        width: "80%",
        padding: "10px 20px",
        border: "2px solid #e5e1e1",
        margin: "auto",
      }}
    >
      <Grid rows={rowsData} columns={columnHeadersData}>
        <PagingState defaultCurrentPage={0} pageSize={50} />
        <EditingState columnEditingEnabled={true} />
        <SortingState />
        <FilteringState defaultFilters={[]} />
        <IntegratedSorting
          columnExtensions={integratedSortingColumnExtensions}
        />
        <SearchState />
        <IntegratedFiltering />
        <IntegratedPaging />
        <Table />
        <TableColumnResizing />
        <DragDropProvider />
        <TableHeaderRow showSortingControls />
        <TableFilterRow />
        <TableColumnReordering
          order={columnOrdersData}
          onOrderChange={setColumnOrdersData}
        />

        <Toolbar />
        <Stack spacing={2} direction="row">
          <ExportPanel startExport={startExport} />
          <Button variant="contained" onClick={handleEditHeader}>
            Edit Header
          </Button>
          <Button variant="contained">Save</Button>
          <Button variant="contained">Fetch Files</Button>
        </Stack>

        <PagingPanel />
      </Grid>

      <GridExporter
        ref={exporterRef}
        rows={rowsData}
        columns={columnHeadersData}
        onSave={onSave}
        // customizeHeader={customizeHeader}
        columnOrder={columnOrdersData}
      />
      {setEditHeaderStatus && (
        <ConfirmationModal
          onShow={editHeaderStatus}
          onClose={() => setEditHeaderStatus(false)}
          columnHeader={columnHeadersData}
          handleColumnHeader={handleColumnHeader}
        />
      )}
    </Paper>
  );
}

export { DataGrid };
