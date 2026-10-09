import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly roleRecorded: boolean;
  readonly creditPresent: boolean;
  readonly sourceChecked: boolean;
};
export type Output = {
  readonly uncreditedRecordedRole: boolean;
  readonly unresolvedSource: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roleRecorded: { type: "boolean" },
    creditPresent: { type: "boolean" },
    sourceChecked: { type: "boolean" },
  },
  required: ["roleRecorded", "creditPresent", "sourceChecked"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uncreditedRecordedRole: { type: "boolean" },
    unresolvedSource: { type: "boolean" },
  },
  required: ["uncreditedRecordedRole", "unresolvedSource"],
} as const;
/** Distinguish an explicit checked uncredited-role record from unchecked source information without inferring representation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { roleRecorded, creditPresent, sourceChecked } = request;
  const compute = (): Output => {
    return {
      uncreditedRecordedRole: sourceChecked && roleRecorded && !creditPresent,
      unresolvedSource: !sourceChecked,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { roleRecorded: true, creditPresent: false, sourceChecked: true },
  output: { uncreditedRecordedRole: true, unresolvedSource: false },
} satisfies ToolExample<Input, Output>;
export const representationRoleUncreditedMissingFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["gender-studies", "gender studies", "social sciences"],
        keywords: ["gender studies", "social sciences"],
      },
      id: "gender-studies/representation-role-uncredited-missing-flag",
      title: "Representation Role Uncredited Missing Flag",
      description:
        "Distinguish an explicit checked uncredited-role record from unchecked source information without inferring representation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          roleRecorded: { type: "boolean" },
          creditPresent: { type: "boolean" },
          sourceChecked: { type: "boolean" },
        },
        required: ["roleRecorded", "creditPresent", "sourceChecked"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          uncreditedRecordedRole: { type: "boolean" },
          unresolvedSource: { type: "boolean" },
        },
        required: ["uncreditedRecordedRole", "unresolvedSource"],
      },
      ports: {
        inputs: [
          {
            id: "roleRecorded",
            label: "Role Recorded",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "creditPresent",
            label: "Credit Present",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "sourceChecked",
            label: "Source Checked",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "uncreditedRecordedRole",
            label: "Uncredited Recorded Role",
            valueType: { type: "boolean" },
          },
          {
            id: "unresolvedSource",
            label: "Unresolved Source",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = representationRoleUncreditedMissingFlagTool.execute;
export default representationRoleUncreditedMissingFlagTool;
