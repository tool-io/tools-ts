import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly personId: string;
  readonly authorizedPeople: readonly string[];
  readonly role: string;
  readonly authorizedRoles: readonly string[];
  readonly eventDay: number;
  readonly startDay: number;
  readonly endDay: number;
};
export type Output = {
  readonly personListed: boolean;
  readonly roleListed: boolean;
  readonly timeListed: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personId: { type: "string", maxLength: 8192 },
    authorizedPeople: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    role: { type: "string", maxLength: 8192 },
    authorizedRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    eventDay: { type: "integer" },
    startDay: { type: "integer" },
    endDay: { type: "integer" },
  },
  required: [
    "personId",
    "authorizedPeople",
    "role",
    "authorizedRoles",
    "eventDay",
    "startDay",
    "endDay",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personListed: { type: "boolean" },
    roleListed: { type: "boolean" },
    timeListed: { type: "boolean" },
  },
  required: ["personListed", "roleListed", "timeListed"],
} as const;
/** Audit explicit study-personnel authorization records. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    personId,
    authorizedPeople,
    role,
    authorizedRoles,
    eventDay,
    startDay,
    endDay,
  } = request;
  const compute = (): Output => {
    H.domain(endDay >= startDay);
    return {
      personListed: authorizedPeople.includes(personId),
      roleListed: authorizedRoles.includes(role),
      timeListed: eventDay >= startDay && eventDay <= endDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    personId: "A",
    authorizedPeople: ["A"],
    role: "analyst",
    authorizedRoles: ["analyst"],
    eventDay: 105,
    startDay: 100,
    endDay: 110,
  },
  output: { personListed: true, roleListed: true, timeListed: true },
} satisfies ToolExample<Input, Output>;
export const glpStudyPersonnelRoleWindowTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "glp/glp-study-personnel-role-window",
    title: "GLP Study Personnel Role Window Tool",
    description: "Audit explicit study-personnel authorization records.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personId: { type: "string", maxLength: 8192 },
        authorizedPeople: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        role: { type: "string", maxLength: 8192 },
        authorizedRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        eventDay: { type: "integer" },
        startDay: { type: "integer" },
        endDay: { type: "integer" },
      },
      required: [
        "personId",
        "authorizedPeople",
        "role",
        "authorizedRoles",
        "eventDay",
        "startDay",
        "endDay",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personListed: { type: "boolean" },
        roleListed: { type: "boolean" },
        timeListed: { type: "boolean" },
      },
      required: ["personListed", "roleListed", "timeListed"],
    },
    ports: {
      inputs: [
        {
          id: "personId",
          label: "Person Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "authorizedPeople",
          label: "Authorized People",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "role",
          label: "Role",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "authorizedRoles",
          label: "Authorized Roles",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "eventDay",
          label: "Event Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "startDay",
          label: "Start Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endDay",
          label: "End Day",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "personListed",
          label: "Person Listed",
          valueType: { type: "boolean" },
        },
        {
          id: "roleListed",
          label: "Role Listed",
          valueType: { type: "boolean" },
        },
        {
          id: "timeListed",
          label: "Time Listed",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = glpStudyPersonnelRoleWindowTool.execute;
export default glpStudyPersonnelRoleWindowTool;
