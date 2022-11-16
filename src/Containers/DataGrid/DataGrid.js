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
import { EditingState } from '@devexpress/dx-react-grid';

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

const columns = [
  { name: "id", title: "ID" },
  { name: "product", title: "Product" },
  { name: "firstName", title: "First Name" },
  { name: "middleName", title: "Middle Name" },
  { name: "lastName", title: "Last Name" },
  { name: "company", title: "Company" },
  { name: "date", title: "Date of joining" },
];

const rows = [
  {
    id: 0,
    product: "DevExtreme",
    owner: "DevExpress",
    firstName: "David",
    middleName: "N",
    lastName: "Peter",
    company: "infopine",
    date: "17/05/2020",
  },
  {
    id: 1,
    product: "DevExtreme Reactive",
    owner: "DevExpress",
    firstName: "Colter",
    middleName: "Ozzy",
    lastName: "Loyal",
    company: "infopine",
    date: "17/05/2020",
  },
  {
    id: 2,
    product: "John",
    owner: "DevExpress",
    firstName: "Khai",
    middleName: "Evander",
    lastName: "Camilo",
    company: "infopine",
    date: "17/05/2020",
  },
  {
    id: 3,
    product: "Petere",
    owner: "DevExpress",
    firstName: "Mac",
    middleName: "Jiraiya",
    lastName: "Banks",
    company: "infopine",
    date: "17/05/2020",
  },
  {
    id: 4,
    product: "TEste",
    owner: "DevExpress",
    firstName: "Gian",
    middleName: "Wylder",
    lastName: "Elio",
    company: "infopine",
    date: "17/05/2020",
  },
  {
    id: 5,
    product: "Naveen",
    owner: "DevExpress",
    firstName: "Kylian",
    middleName: "Cillian",
    lastName: "Bridger",
    company: "infopine",
    date: "17/05/2020",
  },
  {
    id: 6,
    product: "Kumar",
    owner: "DevExpress",
    firstName: "Onyx",
    middleName: "Zyair",
    lastName: "Koen",
    company: "infopine",
    date: "17/05/2020",
  },
];

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

function DataGrid() {
  const exporterRef = useRef(null);
  const [columnOrder, setColumnOrder] = useState([
    "id",
    "product",
    "firstName",
    "middleName",
    "lastName",
    "company",
    "date",
  ]);

  const [integratedSortingColumnExtensions] = useState([
    { columnName: "priority", compare: comparePriority },
  ]);
  const [defaultColumnWidths] = useState([
    { columnName: "id", width: 180 },
    { columnName: "product", width: 180 },
    { columnName: "firstName", width: 180 },
    { columnName: "middleName", width: 180 },
    { columnName: "lastName", width: 240 },
    { columnName: "company", width: 240 },
    { columnName: "date", width: 240 },
  ]);

  const startExport = useCallback(() => {
    exporterRef.current.exportGrid();
  }, [exporterRef]);

  return (
    <Paper>
      <Grid rows={rows} columns={columns}>
        <PagingState defaultCurrentPage={0} pageSize={3} />
        <EditingState
        columnEditingEnabled = {true}
        />
        <SortingState />
        <FilteringState defaultFilters={[]} />
        <IntegratedSorting
          columnExtensions={integratedSortingColumnExtensions}
        />
        <SearchState />
        <IntegratedFiltering />
        <IntegratedPaging />
        <Table />
        <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
        <DragDropProvider />
        <TableHeaderRow showSortingControls editingEnabled = {false}/>
        <TableFilterRow />
        <TableColumnReordering
          order={columnOrder}
          onOrderChange={setColumnOrder}
        />

        <Toolbar />
        <ExportPanel startExport={startExport} />
        <PagingPanel />
      </Grid>

      <GridExporter
        ref={exporterRef}
        rows={rows}
        columns={columns}
        onSave={onSave}
        // customizeHeader={customizeHeader}
        columnOrder={columnOrder}
      />
    </Paper>
  );
}

export { DataGrid };
