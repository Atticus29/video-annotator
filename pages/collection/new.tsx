import { Grid } from "@mui/material";
import CollectionDetailsEdit from "../../components/CollectionDetailsEdit";
import useFirebaseAuth from "../../hooks/useFirebaseAuth";
import UnsavedChangesPrompt from "../../components/UnsavedChangesPrompt";

const NewCollection: React.FC = () => {
  // const { user, authError } = useFirebaseAuth();

  return (
    <>
      <UnsavedChangesPrompt />
      <Grid container spacing={2} style={{ marginTop: "1vh" }}>
        <>
          <Grid item sm={12} md={12}>
            <CollectionDetailsEdit titleId="CREATE_COLLECTION" mode="create" />
          </Grid>
        </>
      </Grid>
    </>
  );
};

export default NewCollection;
