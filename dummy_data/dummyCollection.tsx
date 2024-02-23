import { FormFieldGroup, SingleFormField, Collection } from "../types";
import {
  isNonEmptyString,
  isValidOption,
  isValidUrl,
} from "../utilities/validators";

import moveNames from "./moveNames";
import tournamentNames from "./tournamentNames";
import locationNames from "./locationNames";
import { excludeFromCollectionTableDisplay } from "../constants";
// import dayjs from "dayjs";

export const defaultDoNotDisplays: string[] = [
  "_id",
  "key",
  "testId",
  "doNotDisplay",
  "shouldBeCheckboxes",
  "invalidInputMessage",
  "validatorMethods",
  "shouldBeCheckboxes",
];

export const individualsQuestion: SingleFormField = {
  type: "text",
  label: "Individuals",
  isRequired: true,
  language: "English",
  testId: "individuals",
  doNotDisplay: defaultDoNotDisplays,
  invalidInputMessage: "MUST_SELECT_AT_LEAST_ONE_INDIVIDUAL",
  validatorMethods: [isNonEmptyString],
  shouldBeCheckboxes: ["isRequired"],
};

const firstQuestion: SingleFormField = {
  type: "URL",
  label: "URL",
  isRequired: true,
  language: "English",
  testId: "url",
  doNotDisplay: defaultDoNotDisplays,
  invalidInputMessage: "MUST_BE_VALID_URL",
  validatorMethods: [isValidUrl],
  shouldBeCheckboxes: ["isRequired"],
  isACoreQuestion: true,
};

const secondQuestion: SingleFormField = {
  type: "Autocomplete",
  label: "Tournament Name",
  isRequired: false,
  autocompleteOptions: [...tournamentNames],
  usersCanAddCustomOptions: true,
  language: "English",
  testId: "tournament",
  doNotDisplay: [...defaultDoNotDisplays, "autocompleteOptions"],
  shouldBeCheckboxes: ["isRequired"],
  validatorMethods: [isNonEmptyString],
  invalidInputMessage: "FIELD_CANNOT_BE_BLANK",
};

const locationName: SingleFormField = {
  type: "Autocomplete",
  label: "Location Name",
  isRequired: false,
  autocompleteOptions: [...locationNames],
  usersCanAddCustomOptions: true,
  language: "English",
  testId: "locationNames",
  doNotDisplay: [...defaultDoNotDisplays, "autocompleteOptions"],
  shouldBeCheckboxes: ["isRequired"],
  validatorMethods: [isNonEmptyString],
  invalidInputMessage: "FIELD_CANNOT_BE_BLANK",
};

const thirdQuestion: SingleFormField = {
  type: "Checkbox",
  label: "Gi?",
  isRequired: false,
  language: "English",
  testId: "isGi",
  doNotDisplay: defaultDoNotDisplays,
  validatorMethods: [],
  shouldBeCheckboxes: ["isRequired"],
};

const fourthQuestion: SingleFormField = {
  type: "Date",
  label: "Date of match",
  language: "English",
  testId: "matchDate",
  doNotDisplay: defaultDoNotDisplays,
  validatorMethods: [],
  shouldBeCheckboxes: ["isRequired"],
};

// const fifthQuestion: SingleFormField = { // deprecated. Individuals are getting attached to each video directly as a separate step in video intake.
//   label: "Name of Athlete on the Left",
//   type: "Autocomplete",
//   language: "English",
//   isRequired: true,
//   testId: "athleteLeftName",
//   doNotDisplay: [...defaultDoNotDisplays, "autocompleteOptions"],
//   shouldBeCheckboxes: ["isRequired"],
//   validatorMethods: [isNonEmptyString],
//   invalidInputMessage: "INPUT_INVALID",
//   autocompleteOptions: [
//     "Fisher, Mark",
//     "Deodara, Dirt",
//     "Ziegler, Eddie",
//     "Diggins, John",
//   ],
//   usersCanAddCustomOptions: true,
// };

const sixthQuestion: SingleFormField = {
  label: "Age",
  type: "Number",
  language: "English",
  testId: "age",
  doNotDisplay: defaultDoNotDisplays,
  shouldBeCheckboxes: ["isRequired"],
  validatorMethods: [],
  invalidInputMessage: "INPUT_INVALID",
  isRequired: false,
};

const numberReferees: SingleFormField = {
  label: "Number of Referees",
  type: "Number",
  language: "English",
  testId: "numberReferees",
  doNotDisplay: defaultDoNotDisplays,
  shouldBeCheckboxes: ["isRequired"],
  validatorMethods: [],
  invalidInputMessage: "INPUT_INVALID",
  isRequired: false,
};

const seventhQuestion: SingleFormField = {
  label: "mystery string",
  type: "Text",
  language: "English",
  isRequired: false,
  testId: "url",
  doNotDisplay: defaultDoNotDisplays,
  invalidInputMessage: "FIELD_CANNOT_BE_BLANK",
  validatorMethods: [isNonEmptyString],
  shouldBeCheckboxes: ["isRequired"],
};

const lastNameIndividualQuestion: SingleFormField = {
  label: "Last Name",
  type: "Text",
  language: "English",
  isRequired: true,
  testId: "url",
  doNotDisplay: defaultDoNotDisplays,
  invalidInputMessage: "FIELD_CANNOT_BE_BLANK",
  validatorMethods: [isNonEmptyString],
  shouldBeCheckboxes: ["isRequired"],
};

const firstNameIndividualQuestion: SingleFormField = {
  label: "First Name",
  type: "Text",
  language: "English",
  isRequired: true,
  testId: "url",
  doNotDisplay: defaultDoNotDisplays,
  invalidInputMessage: "FIELD_CANNOT_BE_BLANK",
  validatorMethods: [isNonEmptyString],
  shouldBeCheckboxes: ["isRequired"],
};

const genderIndividualQuestion: SingleFormField = {
  label: "Gender",
  type: "Autocomplete",
  language: "English",
  isRequired: false,
  testId: "gender",
  doNotDisplay: [...defaultDoNotDisplays, "autocompleteOptions"],
  shouldBeCheckboxes: ["isRequired"],
  validatorMethods: [isNonEmptyString],
  invalidInputMessage: "INPUT_INVALID",
  autocompleteOptions: [
    "Male",
    "Female",
    "Trans Male",
    "Trans Female",
    "Non-binary",
  ],
  usersCanAddCustomOptions: false,
};

const giRankIndividualQuestion: SingleFormField = {
  label: "Gi Rank",
  type: "Autocomplete",
  language: "English",
  isRequired: false,
  testId: "giRank",
  doNotDisplay: [...defaultDoNotDisplays, "autocompleteOptions"],
  shouldBeCheckboxes: ["isRequired"],
  validatorMethods: [isNonEmptyString],
  invalidInputMessage: "INPUT_INVALID",
  autocompleteOptions: ["White", "Blue", "Purple", "Brown", "Black"],
  usersCanAddCustomOptions: true,
};

const noGiRankIndividualQuestion: SingleFormField = {
  label: "No Gi Rank",
  type: "Autocomplete",
  language: "English",
  isRequired: false,
  testId: "noGiRank",
  doNotDisplay: [...defaultDoNotDisplays, "autocompleteOptions"],
  shouldBeCheckboxes: ["isRequired"],
  validatorMethods: [isNonEmptyString],
  invalidInputMessage: "INPUT_INVALID",
  autocompleteOptions: ["Novice", "Intermediate", "Advanced", "Elite"],
  usersCanAddCustomOptions: true,
};

const allRanks: SingleFormField = {
  label: "Rank",
  type: "Autocomplete",
  language: "English",
  isRequired: false,
  testId: "allRanks",
  doNotDisplay: [...defaultDoNotDisplays, "autocompleteOptions"],
  shouldBeCheckboxes: ["isRequired"],
  validatorMethods: [isNonEmptyString],
  invalidInputMessage: "INPUT_INVALID",
  autocompleteOptions: [
    "White",
    "Blue",
    "Purple",
    "Brown",
    "Black",
    "Novice",
    "Intermediate",
    "Advanced",
    "Elite",
  ],
  usersCanAddCustomOptions: true,
};

const natureOfTheMatch: SingleFormField = {
  type: "Autocomplete",
  label: "Nature of the Match",
  isRequired: true,
  autocompleteOptions: [
    "Competition",
    "Practice/Training",
    "Highlight",
    "Instructional",
  ],
  usersCanAddCustomOptions: true,
  language: "English",
  testId: "natureOfTheMatch",
  doNotDisplay: [...defaultDoNotDisplays, "autocompleteOptions"],
  shouldBeCheckboxes: ["isRequired"],
  validatorMethods: [isNonEmptyString],
  invalidInputMessage: "INPUT_INVALID",
};

const weightClassIndividualQuestion: SingleFormField = {
  label: "Weight Class",
  type: "Autocomplete",
  language: "English",
  isRequired: false,
  testId: "weightClass",
  doNotDisplay: [...defaultDoNotDisplays, "autocompleteOptions"],
  shouldBeCheckboxes: ["isRequired"],
  validatorMethods: [isNonEmptyString],
  invalidInputMessage: "INPUT_INVALID",
  autocompleteOptions: [
    "+60 kg",
    "+99 kg",
    "-60 kg",
    "-66 kg",
    "-88 kg",
    "-99 kg",
    "Absolute; Open Class",
    "Bantam",
    "Catchweight",
    "Feather",
    "Heavy",
    "Light",
    "Light-feather",
    "Medium-heavy",
    "Middle",
    "Rooster",
    "Welterweight",
    "Unknown",
  ],
  usersCanAddCustomOptions: true,
};

const ageClassIndividualQuestion: SingleFormField = {
  label: "Age Class",
  type: "Autocomplete",
  language: "English",
  isRequired: false,
  testId: "ageClass",
  doNotDisplay: [...defaultDoNotDisplays, "autocompleteOptions"],
  shouldBeCheckboxes: ["isRequired"],
  validatorMethods: [isNonEmptyString],
  invalidInputMessage: "INPUT_INVALID",
  autocompleteOptions: [
    "Adult",
    "Juvenile 1",
    "Juvenile 2",
    "Master 1",
    "Master 2",
    "Master 3",
    "Master 4",
    "Master 5",
    "Master 6",
    "Unknown",
    "Youth",
  ],
  usersCanAddCustomOptions: true,
};

const moveNameQuestion: SingleFormField = {
  label: "Name of move",
  type: "Autocomplete",
  language: "English",
  isRequired: true,
  testId: "moveName",
  doNotDisplay: [...defaultDoNotDisplays, "autocompleteOptions"],
  shouldBeCheckboxes: ["isRequired"],
  validatorMethods: [isNonEmptyString],
  invalidInputMessage: "INPUT_INVALID",
  autocompleteOptions: [...moveNames],
  usersCanAddCustomOptions: true,
  isACoreQuestion: true,
};

const startingPositionOfActor: SingleFormField = {
  label: "Starting Position of Actor",
  type: "Autocomplete",
  language: "English",
  isRequired: true,
  testId: "startingPositionOfActor",
  doNotDisplay: [...defaultDoNotDisplays, "autocompleteOptions"],
  shouldBeCheckboxes: ["isRequired"],
  validatorMethods: [isNonEmptyString],
  invalidInputMessage: "INPUT_INVALID",
  autocompleteOptions: [
    "Mount Top",
    "Mount Bottom",
    "Knee on Belly Top",
    "Knee on Belly Bottom",
    "North South Top",
    "North South Bottom",
    "Back Control Top",
    "Back Control Bottom",
    "Closed Guard Bottom",
    "Closed Guard Top",
    "Open Guard Top",
    "Open Guard Bottom",
    "Half Guard Bottom",
    "Half Guard Top",
    "Back Mount Top",
    "Back Mount Bottom",
  ],
  usersCanAddCustomOptions: true,
};

const startingPositionOfSubject: SingleFormField = {
  label: "Starting Position of Subject/Target",
  type: "Autocomplete",
  language: "English",
  isRequired: true,
  testId: "startingPositionOfSubject",
  doNotDisplay: [...defaultDoNotDisplays, "autocompleteOptions"],
  shouldBeCheckboxes: ["isRequired"],
  validatorMethods: [isNonEmptyString],
  invalidInputMessage: "INPUT_INVALID",
  autocompleteOptions: [
    "Mount Top",
    "Mount Bottom",
    "Knee on Belly Top",
    "Knee on Belly Bottom",
    "North South Top",
    "North South Bottom",
    "Back Control Top",
    "Back Control Bottom",
    "Closed Guard Bottom",
    "Closed Guard Top",
    "Open Guard Top",
    "Open Guard Bottom",
    "Half Guard Bottom",
    "Half Guard Top",
    "Back Mount Top",
    "Back Mount Bottom",
  ],
  usersCanAddCustomOptions: true,
};

const endingPositionOfActor: SingleFormField = {
  label: "Ending Position of Actor",
  type: "Autocomplete",
  language: "English",
  isRequired: true,
  testId: "endingPositionOfActor",
  doNotDisplay: [...defaultDoNotDisplays, "autocompleteOptions"],
  shouldBeCheckboxes: ["isRequired"],
  validatorMethods: [isNonEmptyString],
  invalidInputMessage: "INPUT_INVALID",
  autocompleteOptions: [
    "Mount Top",
    "Mount Bottom",
    "Knee on Belly Top",
    "Knee on Belly Bottom",
    "North South Top",
    "North South Bottom",
    "Back Control Top",
    "Back Control Bottom",
    "Closed Guard Bottom",
    "Closed Guard Top",
    "Open Guard Top",
    "Open Guard Bottom",
    "Half Guard Bottom",
    "Half Guard Top",
    "Back Mount Top",
    "Back Mount Bottom",
  ],
  usersCanAddCustomOptions: true,
};

const endingPositionOfSubject: SingleFormField = {
  label: "Ending Position of Subject/Target",
  type: "Autocomplete",
  language: "English",
  isRequired: true,
  testId: "endingPositionOfSubject",
  doNotDisplay: [...defaultDoNotDisplays, "autocompleteOptions"],
  shouldBeCheckboxes: ["isRequired"],
  validatorMethods: [isNonEmptyString],
  invalidInputMessage: "INPUT_INVALID",
  autocompleteOptions: [
    "Mount Top",
    "Mount Bottom",
    "Knee on Belly Top",
    "Knee on Belly Bottom",
    "North South Top",
    "North South Bottom",
    "Back Control Top",
    "Back Control Bottom",
    "Closed Guard Bottom",
    "Closed Guard Top",
    "Open Guard Top",
    "Open Guard Bottom",
    "Half Guard Bottom",
    "Half Guard Top",
    "Back Mount Top",
    "Back Mount Bottom",
  ],
  usersCanAddCustomOptions: true,
};

const actorName: SingleFormField = {
  label: "Actor Name",
  type: "Autocomplete",
  language: "English",
  isRequired: true,
  testId: "actorName",
  doNotDisplay: [...defaultDoNotDisplays, "autocompleteOptions"],
  shouldBeCheckboxes: ["isRequired"],
  validatorMethods: [isNonEmptyString],
  invalidInputMessage: "INPUT_INVALID",
  autocompleteOptions: ["TODO Populate With Individuals Somehow"],
  usersCanAddCustomOptions: true,
};

const pointsScored: SingleFormField = {
  label: "Number of Points Scored, If Any",
  type: "Number",
  language: "English",
  testId: "pointsScored",
  doNotDisplay: defaultDoNotDisplays,
  shouldBeCheckboxes: ["isRequired"],
  validatorMethods: [],
  invalidInputMessage: "INPUT_INVALID",
  isRequired: false,
};

const isSuccessful: SingleFormField = {
  label: "Was the move successful?",
  type: "Checkbox",
  language: "English",
  isRequired: true,
  testId: "isSuccessful",
  doNotDisplay: defaultDoNotDisplays,
  validatorMethods: [],
  shouldBeCheckboxes: ["isRequired"],
};

const isSubmission: SingleFormField = {
  label: "Was the move a successful submission?",
  type: "Checkbox",
  language: "English",
  isRequired: true,
  testId: "isSubmission",
  doNotDisplay: defaultDoNotDisplays,
  validatorMethods: [],
  shouldBeCheckboxes: ["isRequired"],
};

const isAdvantage: SingleFormField = {
  label: "Did this move score an advantage?",
  type: "Checkbox",
  language: "English",
  isRequired: true,
  testId: "isAdvantage",
  doNotDisplay: defaultDoNotDisplays,
  validatorMethods: [],
  shouldBeCheckboxes: ["isRequired"],
};

const moveRating: SingleFormField = {
  label: "Rating of quality of this move, 1-10 with 10 being best",
  type: "Autocomplete",
  language: "English",
  isRequired: true,
  testId: "moveRating",
  doNotDisplay: [...defaultDoNotDisplays, "autocompleteOptions"],
  shouldBeCheckboxes: ["isRequired"],
  validatorMethods: [isNonEmptyString],
  invalidInputMessage: "INPUT_INVALID",
  autocompleteOptions: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  usersCanAddCustomOptions: false,
};

const typeOfRoundQuestion: SingleFormField = {
  label: "What type of round is this?",
  type: "Autocomplete",
  language: "English",
  isRequired: true,
  testId: "typeOfRound",
  doNotDisplay: [...defaultDoNotDisplays, "autocompleteOptions"],
  shouldBeCheckboxes: ["isRequired"],
  validatorMethods: [isNonEmptyString],
  invalidInputMessage: "INPUT_INVALID",
  autocompleteOptions: [
    "Finals",
    "Semi-finals",
    "Quarter-finals",
    "Not applicable",
  ],
  usersCanAddCustomOptions: true,
};

const comment: SingleFormField = {
  label: "Comment - any information not captured by the other questions?",
  type: "Text",
  language: "English",
  isRequired: false,
  testId: "comment",
  doNotDisplay: defaultDoNotDisplays,
  invalidInputMessage: "FIELD_CANNOT_BE_BLANK",
  validatorMethods: [isNonEmptyString],
  shouldBeCheckboxes: ["isRequired"],
};

export const shamCollectionShell: Collection = {
  // _id: "test123",
  metadata: {
    name: "Example Collection",
    createdByEmail: "public@example.com",
    dateCreated: Date(),
    nameOfVideo: "Match",
    nameOfVideoPlural: "Matches",
    nameOfEvent: "Move",
    nameOfEventPlural: "Moves",
    nameOfIndividual: "Athlete",
    nameOfIndividualPlural: "Athletes",
    isPrivate: false,
    language: "English",
  },
  excludeFromDetailList: excludeFromCollectionTableDisplay,
};

export const shamCollection: Collection = {
  // _id: "test123",
  metadata: {
    name: "Example Collection",
    createdByEmail: "public@example.com",
    dateCreated: Date(),
    nameOfVideo: "Match",
    nameOfVideoPlural: "Matches",
    nameOfEvent: "Move",
    nameOfEventPlural: "Moves",
    nameOfIndividual: "Athlete",
    nameOfIndividualPlural: "Athletes",
    isPrivate: false,
    language: "English",
  },
  videoIntakeQuestions: [
    // there MUST be a URL question in this list. Even if this shamCollection is deprecated by something else, that thing should also have a URL question.
    firstQuestion,
    natureOfTheMatch,
    typeOfRoundQuestion,
    secondQuestion,
    locationName,
    thirdQuestion,
    allRanks,
    weightClassIndividualQuestion,
    fourthQuestion,
    // fifthQuestion,
    // sixthQuestion,
    ageClassIndividualQuestion,
    numberReferees,
    // seventhQuestion,
  ],
  individualIntakeQuestions: [
    // lastNameIndividualQuestion,
    // firstNameIndividualQuestion,
    genderIndividualQuestion,
    // giRankIndividualQuestion,
    // noGiRankIndividualQuestion,
    // weightClassIndividualQuestion,
    // ageClassIndividualQuestion,
  ],
  eventIntakeQuestions: [
    moveNameQuestion,
    // actorName,
    startingPositionOfActor,
    startingPositionOfSubject,
    endingPositionOfActor,
    endingPositionOfSubject,
    pointsScored,
    isSuccessful,
    isSubmission,
    moveRating,
    comment, // @TODO add start time and end time to this
  ],
  excludeFromDetailList: excludeFromCollectionTableDisplay,
};

export const shamCollection2: Collection = {
  // _id: "test123",
  metadata: {
    name: "Brazilian Jiu Jitsu",
    createdByEmail: "public@example.com",
    dateCreated: Date(),
    nameOfVideo: "Match",
    nameOfVideoPlural: "Matches",
    nameOfEvent: "Move",
    nameOfEventPlural: "Moves",
    nameOfIndividual: "Athlete",
    nameOfIndividualPlural: "Athletes",
    isPrivate: false,
    language: "English",
  },
  videoIntakeQuestions: [
    firstQuestion,
    natureOfTheMatch,
    secondQuestion,
    locationName,
    thirdQuestion,
    allRanks,
    weightClassIndividualQuestion,
    fourthQuestion,
    // fifthQuestion,
    sixthQuestion,
    numberReferees,
    // seventhQuestion,
  ],
  individualIntakeQuestions: [
    lastNameIndividualQuestion,
    firstNameIndividualQuestion,
    genderIndividualQuestion,
    giRankIndividualQuestion,
    noGiRankIndividualQuestion,
    weightClassIndividualQuestion,
    ageClassIndividualQuestion,
  ],
  eventIntakeQuestions: [
    moveNameQuestion,
    actorName,
    startingPositionOfActor,
    startingPositionOfSubject,
    endingPositionOfActor,
    endingPositionOfSubject,
    pointsScored,
    isSuccessful,
    isSubmission,
    moveRating,
    comment,
  ],
  excludeFromDetailList: excludeFromCollectionTableDisplay,
};
