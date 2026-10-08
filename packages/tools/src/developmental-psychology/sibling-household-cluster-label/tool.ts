import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly householdCode: string;
  readonly participantCode: string;
  readonly studyCode: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    householdCode: { type: "string", maxLength: 8192, minLength: 1 },
    participantCode: { type: "string", maxLength: 8192, minLength: 1 },
    studyCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["householdCode", "participantCode", "studyCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Namespace explicit participant and household-cluster codes without inferring biological sibling relationships. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { householdCode, participantCode, studyCode } = request;
  const compute = (): Output => {
    H.domain(
      householdCode.length > 0 &&
        participantCode.length > 0 &&
        studyCode.length > 0,
      "householdCode",
    );
    return {
      label: JSON.stringify([studyCode, householdCode, participantCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { householdCode: "H17", participantCode: "P3", studyCode: "ST2" },
  output: { label: '["ST2","H17","P3"]' },
} satisfies ToolExample<Input, Output>;
export const siblingHouseholdClusterLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "developmental-psychology",
        "developmental psychology",
        "psychology",
      ],
      keywords: ["developmental psychology", "psychology"],
    },
    id: "developmental-psychology/sibling-household-cluster-label",
    title: "Sibling Household Cluster Label",
    description:
      "Namespace explicit participant and household-cluster codes without inferring biological sibling relationships.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        householdCode: { type: "string", maxLength: 8192, minLength: 1 },
        participantCode: { type: "string", maxLength: 8192, minLength: 1 },
        studyCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["householdCode", "participantCode", "studyCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "householdCode",
          label: "Household Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "participantCode",
          label: "Participant Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "studyCode",
          label: "Study Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = siblingHouseholdClusterLabelTool.execute;
export default siblingHouseholdClusterLabelTool;
