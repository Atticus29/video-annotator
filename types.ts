import { Interface } from "readline/promises";

export interface User {
  uid: string;
  alternateIds?: string[];
  roles: UserRole[];
  collectionIds?: string[];
  videoIds?: string[];
}

export interface UserRole {
  roleName: string;
  status: boolean;
  auditTrail: Audit[];
}

export interface Audit {
  previousState: string;
  newState: string;
  dateOfChange: string;
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

export interface EventMetadata {
  annotatorId: string;
  startTime: number; // @TODO ?
  endTime: number;
  upvotes: number;
  downvotes: number;
  flaggedVotes: number;
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
