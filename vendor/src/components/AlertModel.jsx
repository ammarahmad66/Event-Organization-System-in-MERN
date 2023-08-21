import { useState } from "react";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Dialog, DialogTitle, DialogContent } from "@material-ui/core";

const AlertModel = (props) => {
  const [open, setOpen] = useState(props.status);
  const handlechange = () => {
    props.handlealert();
  };
  return (
    <Dialog open={open} onClose={handlechange}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {props.message}
        </Alert>
      </DialogContent>
    </Dialog>
  );
};

export default AlertModel;
