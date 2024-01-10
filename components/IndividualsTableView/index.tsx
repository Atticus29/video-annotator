import { get, map, reduce } from "lodash-es";
import { useEffect, useMemo, useState } from "react";
import useGetIndividuals from "../../hooks/useGetIndividuals";
import DataTable from "../DataTable";
import { IntlShape, useIntl } from "react-intl";
import { CircularProgress } from "@mui/material";
import CustomError from "../Error";

const IndividualsTableView: React.FC<{
  collectionUrl: string;
  tableTitle: string;
  individualIntakeQuestions: any[];
  dataGridOptions?: {};
}> = ({
  collectionUrl,
  tableTitle,
  individualIntakeQuestions,
  dataGridOptions,
}) => {
  const intl: IntlShape = useIntl();

  const {
    isLoading: isLoadingIndividuals,
    isError: isErrorIndividuals,
    data: individualsData,
    errorMsg: errorMsgIndividuals,
    statusMsg,
  } = useGetIndividuals(collectionUrl);
  const individualLinkIds = useMemo(() => {
    if (individualsData) {
      return map(individualsData, (datum) => {
        return get(datum, ["id"]);
      });
    }
  }, [individualsData]);

  const individualDataWithActions = useMemo(() => {
    let individualDataWithActionsAppended: any[] = [];
    if (individualsData) {
      individualDataWithActionsAppended = map(individualsData, (datum: {}) => {
        return {
          ...datum,
          actions: "stand in",
        };
      });
    }
    return individualDataWithActionsAppended;
  }, [individualsData]);

  const individualColNamesToDisplay: {} = useMemo(() => {
    // @TODO maybe this should be in a utility file somewhere since this kind of logic pops up in a few places as I wrangle column headers.
    if (individualDataWithActions && individualIntakeQuestions) {
      return reduce(
        individualIntakeQuestions,
        (memo: {}, intakeQuestion: any) => {
          return {
            ...memo,
            [intakeQuestion?.label]: intakeQuestion?.label,
          };
        },
        {}
      );
    } else {
      return {};
    }
  }, [individualIntakeQuestions, individualDataWithActions]);

  const individualColNamesToDisplayWithActions = {
    ...individualColNamesToDisplay,
    actions: "Actions",
  };

  return (
    <>
      {!isLoadingIndividuals && (
        <DataTable
          tableTitle={tableTitle}
          data={individualDataWithActions}
          colNamesToDisplay={individualColNamesToDisplayWithActions}
          actionButtonsToDisplay={{ view: "View" }}
          targetColIdxForUrlPath={0}
          linkUrls={{
            view: "/collection/" + collectionUrl + "/individual/",
          }}
          linkIds={individualLinkIds}
          dataGridOptions={dataGridOptions}
          errorMsg={errorMsgIndividuals}
        ></DataTable>
      )}
      {isLoadingIndividuals && (
        <>
          <br />
          <CircularProgress color="inherit" />
          <br />
        </>
      )}
      {!isLoadingIndividuals && isErrorIndividuals && (
        <>
          <br />
          <CustomError
            statusMsg={statusMsg}
            errorMsg={
              errorMsgIndividuals ||
              intl.formatMessage({
                id: "INDIVIDUALS_NOT_FOUND",
                defaultMessage: "Individuals not found",
              })
            }
          />
        </>
      )}
    </>
  );
};

export default IndividualsTableView;
