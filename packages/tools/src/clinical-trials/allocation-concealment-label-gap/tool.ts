import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expectedLabel: string;
  readonly recordedLabel: string;
  readonly recordKnown: boolean;
};
export type Output = {
  readonly labelMatches: boolean;
  readonly unresolved: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedLabel: { type: "string", maxLength: 8192 },
    recordedLabel: { type: "string", maxLength: 8192 },
    recordKnown: { type: "boolean" },
  },
  required: ["expectedLabel", "recordedLabel", "recordKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labelMatches: { type: "boolean" },
    unresolved: { type: "boolean" },
  },
  required: ["labelMatches", "unresolved"],
} as const;
/** Compare supplied metadata labels; label agreement does not establish allocation concealment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expectedLabel, recordedLabel, recordKnown } = request;
  const compute = (): Output => {
    return {
      labelMatches: recordKnown && expectedLabel === recordedLabel,
      unresolved: !recordKnown,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { expectedLabel: "masked", recordedLabel: "open", recordKnown: true },
  output: { labelMatches: false, unresolved: false },
} satisfies ToolExample<Input, Output>;
export const allocationConcealmentLabelGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-trials/allocation-concealment-label-gap",
    title: "Allocation Concealment Label Gap Tool",
    description:
      "Compare supplied metadata labels; label agreement does not establish allocation concealment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedLabel: { type: "string", maxLength: 8192 },
        recordedLabel: { type: "string", maxLength: 8192 },
        recordKnown: { type: "boolean" },
      },
      required: ["expectedLabel", "recordedLabel", "recordKnown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        labelMatches: { type: "boolean" },
        unresolved: { type: "boolean" },
      },
      required: ["labelMatches", "unresolved"],
    },
    ports: {
      inputs: [
        {
          id: "expectedLabel",
          label: "Expected Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedLabel",
          label: "Recorded Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordKnown",
          label: "Record Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "labelMatches",
          label: "Label Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "unresolved",
          label: "Unresolved",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = allocationConcealmentLabelGapTool.execute;
export default allocationConcealmentLabelGapTool;
