import * as React from "react";

import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import LocalHospital from "@material-ui/icons/LocalHospital";

import { IAppConfig } from "../shared/Interfaces";

const styles = {
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  root: {
    flexGrow: 1
  }
};

export interface IHeaderProps {
  config: IAppConfig;
  onNavigateToHome: () => void;
  onNavigateToPets: () => void;
  onNavigateToVets: () => void;
}

function Header(props: IHeaderProps) {
  const { classes } = props as any;
  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
            onClick={props.onNavigateToHome}
          >
            <LocalHospital />
            <Typography variant="h4" color="inherit" className={classes.grow}>
              {props.config.businessName}
            </Typography>
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.grow} />
          <Button color="inherit" onClick={props.onNavigateToPets}>
            Pets
          </Button>
          <Button color="inherit" onClick={props.onNavigateToVets}>
            Vets
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default withStyles(styles)(Header);
