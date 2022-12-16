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
  TableColumnVisibility,
  ColumnChooser,
  GroupingPanel,
  TableGroupRow,
  TableSummaryRow,
} from "@devexpress/dx-react-grid-material-ui";
import saveAs from "file-saver";
import { GridExporter } from "@devexpress/dx-react-grid-export";
import {
  PagingState,
  IntegratedPaging,
  DataTypeProvider,
  IntegratedSummary,
} from "@devexpress/dx-react-grid";
import { SearchState, IntegratedFiltering } from "@devexpress/dx-react-grid";
import {
  SortingState,
  IntegratedSorting,
  FilteringState,
} from "@devexpress/dx-react-grid";
import {
  EditingState,
  GroupingState,
  IntegratedGrouping,
  SummaryState,
} from "@devexpress/dx-react-grid";
import {
  Button,
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  ListItemText,
  Checkbox,
  OutlinedInput,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { dataGridStore } from "../store/DataGrid.store";
import { ConfirmationModal } from "../components/Modal";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 100,
    },
  },
};

//Export excel documents function
const onSave = (workbook) => {
  workbook.xlsx.writeBuffer().then((buffer) => {
    saveAs(
      // new Blob([buffer], { type: "application/octet-stream" }),
      // "DataGrid.xlsx",

      new Blob([buffer], { type: "application/octet-stream" }),
      "file.xlsx"
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

function DataGrid({
  rowsData,
  columnHeadersData,
  handleEditColumnHeader,
  defaultColoumnWidth,
  handleDragDrop,
}) {
  const exporterRef = useRef(null);
  const {
    setEditHeaderStatus,
    editHeaderStatus,
    columnOrdersData,
    setColumnOrdersData,
    summaryData,
  } = dataGridStore((state) => state);

  const [integratedSortingColumnExtensions] = useState([
    { columnName: "priority", compare: comparePriority },
  ]);
  const [filterOption, setFilterOption] = useState();
  const [hiddenColumnNames, setHiddenColumnNames] = useState(columnHeadersData);
  const [grouping, setGrouping] = useState([
    { columnName: columnOrdersData[0] },
  ]);
  const [pageSize, setPageSize] = useState(50);
  const [pageSizes] = useState([50, 100, 200, 500]);

  const [personName, setPersonName] = React.useState([]);
  const [summaryValue, setSummaryValue] = useState("null");

  const CurrencyFormatter = ({ value }) =>
    value.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const CurrencyTypeProvider = (props) => (
    <DataTypeProvider formatterComponent={CurrencyFormatter} {...props} />
  );

  const startExport = useCallback(() => {
    exporterRef.current.exportGrid();
  }, [exporterRef]);

  const handleEditHeader = () => {
    setEditHeaderStatus(true);
  };

  const handleColumnHeader = (data) => {
    handleEditColumnHeader(data);
  };
  const handlePDFExport = () => {
    const unit = "pt";
    const size = "A2"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape
    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(15);
    const title = "The Report";
    //pageHeader
    const headers = columnHeadersData.map((item) => ({ name: item.name }));

    const data = rowsData.map((item, index) => ({
      api: item.API,
      auth: item.Auth,
      catorgory: item.Category,
      cors: item.Cors,
      des: item.Description,
      HTTPS: item.HTTPS,
      link: item.Link,
    }));

    let content = {
      startY: 70,
      //  head: headers,
      body: data,
    };
    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("report.pdf");
  };

  const handleDragDropColoumn = (value) => {
    setColumnOrdersData(value);
    handleDragDrop(value);
  };

  const getChildRows = (row, rootRows) => {
    const childRows = rootRows.filter(
      (r) => r.parentId === (row ? row.id : null)
    );
    return childRows.length ? childRows : null;
  };

  const [tableColumnExtensions] = useState([
    { columnName: columnOrdersData[0], align: "left" },
  ]);

  const [totalSummaryItems, setTotalSummaryItems] = useState([
    { columnName: columnHeadersData[0].toString(), type: "count" },
    {
      columnName: personName.length <= 0 ? "null" : personName[0].toString(),
      type: "max",
    },
    {
      columnName: personName.length <= 0 ? "null" : personName[0].toString(),
      type: "sum",
    },
  ]);

  const [currencyColumns] = useState([summaryValue]);
  const handleChange = (event) => {
    setPersonName(event.target.value);
    summaryData.map((item) => {
      item.disable = true;
      if (event.target.value[0] === item.name) {
        item.disable = false;
        setSummaryValue(event.target.value[0]);
        setTotalSummaryItems([
          { columnName: columnHeadersData[0].toString(), type: "count" },
          { columnName: event.target.value[0].toString(), type: "max" },
          { columnName: event.target.value[0].toString(), type: "sum" },
        ]);
      }
      if (event.target.value.length <= 0) {
        item.disable = false;
        setTotalSummaryItems([
          { columnName: columnHeadersData[0].toString(), type: "count" },
          { columnName: null, type: "max" },
          { columnName: null, type: "sum" },
        ]);
        // setSummaryValue(null)
      }
    });
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
        <PagingState
          defaultCurrentPage={0}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
        <EditingState columnEditingEnabled={true} />
        <SortingState />
        <FilteringState filter={filterOption} />
        <IntegratedSorting
          columnExtensions={integratedSortingColumnExtensions}
        />
        <SearchState />
        <IntegratedFiltering />
        <IntegratedPaging />
        <GroupingState grouping={grouping} onGroupingChange={setGrouping} />
        <IntegratedGrouping />
        <CurrencyTypeProvider for={currencyColumns} />
        <SummaryState totalItems={totalSummaryItems} />
        <IntegratedSummary />
        <Table columnExtensions={tableColumnExtensions} />
        <TableColumnResizing />
        <DragDropProvider />

        <TableHeaderRow showSortingControls showGroupingControls />
        <TableSummaryRow />
        <TableFilterRow />
        <TableColumnVisibility
          hiddenColumnNames={hiddenColumnNames}
          onHiddenColumnNamesChange={setHiddenColumnNames}
        />

        <TableColumnReordering
          order={columnOrdersData}
          onOrderChange={(setColumnOrdersData) =>
            handleDragDropColoumn(setColumnOrdersData)
          }
        />
        <TableGroupRow />
        <Toolbar />
        <GroupingPanel showGroupingControls />
        <ColumnChooser />
        <Stack spacing={2} direction="row">
          <ExportPanel startExport={startExport} />
          <Button variant="contained" onClick={handleEditHeader}>
            Edit Header
          </Button>
          <Button variant="contained">Fetch Report</Button>
          <Button variant="contained">Save</Button>
          <Button variant="contained" onClick={handlePDFExport}>
            Export PDF
          </Button>
          <FormControl sx={{ m: 1, width: 200 }}>
            <InputLabel id="demo-multiple-checkbox-label">
              Summary add column
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={personName}
              onChange={handleChange}
              input={<OutlinedInput label="Summary add column" />}
              renderValue={(selected) => selected}
            >
              {summaryData.map((label) => (
                <MenuItem
                  key={label.name}
                  value={label.name}
                  disabled={label.disable}
                >
                  <Checkbox checked={personName.indexOf(label.name) > -1} />
                  <ListItemText primary={label.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <PagingPanel pageSizes={pageSizes} />
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
