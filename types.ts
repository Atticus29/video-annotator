import { Interface } from "readline/promises";

export interface User {
  uid: string;
  alternateIds?: string[];
  roles: UserRoles;
  collectionIds?: string[];
  videoIds?: string[];
}

export interface UserRoles {
  isAdmin?: boolean;
  hasPaid: boolean;
  hasAnnotatedEnough: boolean;
  isModerator: boolean;
  isVerified: boolean;
}

export interface Collection {
  _id?: any;
  metadata: CollectionMetadata;
  videoIntakeQuestions?: SingleFormField[];
  individualIntakeQuestions?: SingleFormField[];
  eventIntakeQuestions?: SingleFormField[];
  excludeFromDetailList: string[];
  videoQuestionsFormFieldGroup?: FormFieldGroup;
  individualQuestionsFormFieldGroup?: FormFieldGroup;
  eventQuestionsFormFieldGroup?: FormFieldGroup;
  videos?: {}[];
  individuals?: {}[];
}

export interface CollectionMetadata {
  name: string;
  urlPath?: string;
  ownerId?: string;
  createdByEmail: string;
  dateCreated: string;
  dateLastUpdated?: string;
  nameOfVideo: string;
  nameOfVideoPlural: string;
  nameOfEvent: string;
  nameOfEventPlural: string;
  nameOfIndividual: string;
  nameOfIndividualPlural: string;
  isPrivate: boolean;
  language: string;
}

export interface FormFieldGroup {
  // shouldBeCheckboxes?: string[]; // @TODO figure out whether this is needed and whether it's part of the FormFieldGroup
  title: string;
  setValues: (input: any) => void;
  actualValues: any;
  isInvalids: any;
  setIsInvalids: (input: any) => void;
}

export interface SingleFormField {
  type: string;
  label: string;
  isRequired?: boolean;
  language: string;
  testId?: string;
  doNotDisplay?: string[];
  invalidInputMessage?: string;
  validatorMethods: ((input: any, optionalInput?: any) => boolean)[];
  shouldBeCheckboxes: string[];
  autocompleteOptions?: string[];
  usersCanAddCustomOptions?: boolean;
  autocompleteExtras?: {};
  isACoreQuestion?: boolean;
  recommendedLabel?: string;
}
