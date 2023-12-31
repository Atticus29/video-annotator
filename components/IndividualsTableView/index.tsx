import { get, map, reduce } from "lodash-es";
import { useEffect, useMemo, useState } from "react";
import useGetIndividuals from "../../hooks/useGetIndividuals";
import DataTable from "../DataTable";
import { IntlShape, useIntl } from "react-intl";
import { CircularProgress } from "@mui/material";
import CustomError from "../Error";
// import { individualsQuestion } from "../../dummy_data/dummyCollection";

const IndividualsTableView: React.FC<{
  collectionUrl: string;
  tableTitle: string;
  //   nameOfIndividual: string;
  //   nameOfIndividualPlural: string;
  //   nameOfVideo: string;
  individualIntakeQuestions: any[];
  dataGridOptions?: {};
}> = ({
  collectionUrl,
  tableTitle,
  //   nameOfIndividual,
  //   nameOfIndividualPlural,
  //   nameOfVideo,
  individualIntakeQuestions,
  dataGridOptions,
}) => {
  const intl: IntlShape = useIntl();
  const [calculatedIndividualTableHeight, setCalculatedIndividualTableHeight] =
    useState<number>(9.4);

  const {
    isLoading: isLoadingIndividuals,
    isError: isErrorIndividuals,
    data: individualsData,
    errorMsg: errorMsgIndividuals,
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
  const individualsFallback: string = intl.formatMessage({
    id: "INDIVIDUALS_PLURAL",
  });

  const individualColNamesToDisplay: {} = useMemo(() => {
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

  useEffect(() => {
    if (!isLoadingIndividuals && !isErrorIndividuals && individualsData) {
      const numIndividualsRows: number = individualsData.length || 1;
      setCalculatedIndividualTableHeight(9.4 + 2.51 * (numIndividualsRows - 1));
    }
  }, [individualsData, isErrorIndividuals, isLoadingIndividuals]);

  const individualFallback: string = intl.formatMessage({
    id: "INDIVIDUAL",
  });

  //   const asteriskIfRequired: string = individualsQuestion?.isRequired ? "*" : "";
  //   const videoFallback: string = intl.formatMessage({ id: "VIDEO" });
  //   const individualsTableText: string =
  //     intl.formatMessage(
  //       { id: "ADD_INDIVIDUAL_TO_VIDEO" },
  //       {
  //         individualName: nameOfIndividual || individualFallback,
  //         individualNamePlural: nameOfIndividualPlural || individualsFallback,
  //         videoName: nameOfVideo || videoFallback,
  //       }
  //     ) + asteriskIfRequired;

  return (
    <>
      {!isLoadingIndividuals && (
        <DataTable
          tableTitle={tableTitle}
          data={individualDataWithActions}
          colNamesToDisplay={individualColNamesToDisplayWithActions}
          actionButtonsToDisplay={{ view: "View" }}
          targetColIdxForUrlPath={0}
          styleOverrides={{
            minHeight: 0,
            height: calculatedIndividualTableHeight + "rem",
            maxHeight: "50vh",
          }}
          linkUrls={{
            view: "/collection/" + collectionUrl + "/individual/",
          }}
          linkIds={individualLinkIds}
          dataGridOptions={dataGridOptions}
        ></DataTable>
      )}
      {isLoadingIndividuals && (
        <>
          <br />
          <CircularProgress color="inherit" />
        </>
      )}
      {!isLoadingIndividuals && isErrorIndividuals && (
        <>
          <br />
          <CustomError
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
