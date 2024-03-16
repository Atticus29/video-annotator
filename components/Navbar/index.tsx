import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useEffect, useMemo, useState } from "react";
import { useRouter, NextRouter } from "next/router";
import { pathsToHideLoginBtnFrom } from "../../utilities/doNotShowLoginBtn";
import useFirebaseAuth from "../../hooks/useFirebaseAuth";
import { FormattedMessage } from "react-intl";

const Navbar: React.FC = () => {
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showLogout, setShowLogout] = useState<boolean>(false);
  const { user, signOut } = useFirebaseAuth();
  const displayName = useMemo(() => {
    return user?.displayName || user?.email;
  }, [user]);
  const router: NextRouter = useRouter();
  const hideLoginBtn: boolean = pathsToHideLoginBtnFrom.includes(
    router.pathname
  );

  useEffect(() => {
    setShowLogin(!user && !hideLoginBtn);
    setShowLogout(Boolean(user));
  }, [user, hideLoginBtn]);

  const handleLogout = async () => {
    await signOut(); // TODO decide whether I also need to trigger a re-render here to get the correct behavior of protecting this url
    router.push("/login");
  };

  const navigateHome: () => void = () => {
    router.push("/me");
  };

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar>
        {/* <Logo
          style={{ display: "block", width: 50, margin: "16px 8px 20px 0" }}
        /> */}
        {displayName && (
          <>
            <Button
              variant="contained"
              color="secondary"
              data-testid="logout-button"
              onClick={navigateHome}
              style={{ marginRight: "1rem" }}
            >
              <FormattedMessage id="HOME" defaultMessage="Home" />
            </Button>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <FormattedMessage
                id="WELCOME_USER"
                values={{ username: displayName }}
              />
            </Typography>
          </>
        )}
        {!displayName && (
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>
        )}
        {showLogin && (
          <Button
            variant="contained"
            color="secondary"
            href="/login"
            data-testid="login-button"
            style={{ textAlign: "right" }}
          >
            <FormattedMessage id="LOGIN" defaultMessage="Login" />
          </Button>
        )}
        {showLogout && (
          <Button
            variant="contained"
            color="secondary"
            data-testid="logout-button"
            onClick={handleLogout}
            style={{ justifyContent: "right" }}
          >
            <FormattedMessage id="LOGOUT" defaultMessage="Logout" />
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
