import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function ConfirmationModal({
  onShow,
  onClose,
  columnHeader,
  handleColumnHeader,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const userDetails = columnHeader.map((item, index) => {
      const details = {
        name: data.get(item.name),
        title: data.get(item.name),
      };
      return details;
    });
    handleColumnHeader(userDetails);
    console.log("userDetails", userDetails);
  };
  return (
    <div>
      <Modal
        open={onShow}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Header Modified
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              {columnHeader.map((item, index) => {
                return (
                  <Box
                    key={`SD${index}`}
                    display="flex"
                    justifyContent="space-between"
                    alignContent="center"
                    alignItems="center"
                    alignSelf="center"
                  >
                    <Typography mt={2}> {item.name}</Typography>

                    <TextField
                      id={index}
                      label={item.name}
                      variant="outlined"
                      name={item.name}
                      sx={{ marginTop: "10px" }}
                      autoFocus
                    ></TextField>
                  </Box>
                );
              })}
              <Box
                sx={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </Box>
            </Box>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
export { ConfirmationModal };
