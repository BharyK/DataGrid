import React from "react";
import AceEditor from "react-ace";
import { Box, Button, FormHelperText } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

function QueryInputBox({ setQuery, value, setValue, isOpen }) {
  const onChange = (newValue) => {
    // setValue(newValue);
    console.log(newValue);
  };

  const onSubmit = () => {
    var Z = value.toLowerCase().slice(value.indexOf("from") + "from".length);
    setQuery(Z.split(" ")[1]);
  };

  return (
    <div
      style={{
        marginTop: "40px",
        padding: "10px 20px",
        borderLeft: "2px solid #e5e1e1",
        borderRight: "2px solid #e5e1e1",
        borderTop: "2px solid #e5e1e1",
        width: "80%",
        margin: "auto",
      }}
    >
      <AceEditor
        placeholder="Select * from API_Details"
        mode="mysql"
        theme="xcode"
        name="blah2"
        // onLoad={this.onLoad}
        onChange={onChange}
        fontSize={14}
        height="250px"
        width="100%"
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={`Select * from API_Details;`}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
      <Box
        display="flex"
        justifyContent="end"
        alignItems="center"
        alignSelf="center"
        alignContent="center"
      >
        <FormHelperText sx={{ color: "red", display : "none" }}>
          Please run query again
        </FormHelperText>
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          style={{ marginTop: "10px" }}
        >
          Run Query
        </Button>
      </Box>
    </div>
  );
}

export { QueryInputBox };
