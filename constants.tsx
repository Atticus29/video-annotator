import { UserRole } from "./types";

export const excludeFromCollectionTableDisplay: string[] = [
  // "_id",
  "id",
  "videoIntakeQuestions",
  "urlPath",
  "ownerId",
  "individualIntakeQuestions",
  "eventIntakeQuestions",
  "excludeFromDetailList",
  "videoQuestionsFormFieldGroup",
  "individualQuestionsFormFieldGroup",
  "eventQuestionsFormFieldGroup",
  "videos",
];

const admin: UserRole = {
  roleName: "admin",
  status: false,
  auditTrail: [
    { previousState: "none", newState: "false", dateOfChange: Date() },
  ],
};

const hasPaid: UserRole = {
  roleName: "hasPaid",
  status: false,
  auditTrail: [
    { previousState: "none", newState: "false", dateOfChange: Date() },
  ],
};
const hasAnnotatedEnough: UserRole = {
  roleName: "hasAnnotatedEnough",
  status: false,
  auditTrail: [
    { previousState: "none", newState: "false", dateOfChange: Date() },
  ],
};
const moderator: UserRole = {
  roleName: "moderator",
  status: false,
  auditTrail: [
    { previousState: "none", newState: "false", dateOfChange: Date() },
  ],
};

const isVerified: UserRole = {
  roleName: "isVerified",
  status: false,
  auditTrail: [
    { previousState: "none", newState: "false", dateOfChange: Date() },
  ],
};

export const defaultRoles: UserRole[] = [
  admin,
  hasPaid,
  hasAnnotatedEnough,
  moderator,
  isVerified,
];
