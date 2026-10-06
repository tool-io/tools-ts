import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstRole: string;
  readonly secondRole: string;
  readonly conflictRecorded: boolean;
};
export type Output = { readonly label: string; readonly sameRole: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstRole: { type: "string", maxLength: 8192, minLength: 1 },
    secondRole: { type: "string", maxLength: 8192, minLength: 1 },
    conflictRecorded: { type: "boolean" },
  },
  required: ["firstRole", "secondRole", "conflictRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    sameRole: { type: "boolean" },
  },
  required: ["label", "sameRole"],
} as const;
/** Display two explicitly supplied roles and a recorded conflict flag without inferring whether the duties conflict. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstRole, secondRole, conflictRecorded } = request;
  const compute = (): Output => {
    H.domain(firstRole.length > 0 && secondRole.length > 0, "firstRole");
    return {
      label:
        firstRole +
        " / " +
        secondRole +
        "; conflict=" +
        (conflictRecorded ? "recorded" : "not recorded"),
      sameRole: firstRole === secondRole,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstRole: "reviewer",
    secondRole: "applicant",
    conflictRecorded: true,
  },
  output: { label: "reviewer / applicant; conflict=recorded", sameRole: false },
} satisfies ToolExample<Input, Output>;
export const dutyConflictingrolePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["applied-ethics", "applied ethics", "philosophy"],
      keywords: ["applied ethics", "philosophy"],
    },
    id: "applied-ethics/duty-conflicting-role-pair",
    title: "Duty Conflicting Role Pair",
    description:
      "Display two explicitly supplied roles and a recorded conflict flag without inferring whether the duties conflict.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstRole: { type: "string", maxLength: 8192, minLength: 1 },
        secondRole: { type: "string", maxLength: 8192, minLength: 1 },
        conflictRecorded: { type: "boolean" },
      },
      required: ["firstRole", "secondRole", "conflictRecorded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        sameRole: { type: "boolean" },
      },
      required: ["label", "sameRole"],
    },
    ports: {
      inputs: [
        {
          id: "firstRole",
          label: "First Role",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondRole",
          label: "Second Role",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "conflictRecorded",
          label: "Conflict Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        { id: "sameRole", label: "Same Role", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = dutyConflictingrolePairTool.execute;
export default dutyConflictingrolePairTool;
