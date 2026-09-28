import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly correctionMade: boolean;
  readonly reasonText: string;
  readonly whitespaceCounts: boolean;
};
export type Output = {
  readonly reasonPresent: boolean;
  readonly requiredReasonMissing: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctionMade: { type: "boolean" },
    reasonText: { type: "string", maxLength: 8192 },
    whitespaceCounts: { type: "boolean" },
  },
  required: ["correctionMade", "reasonText", "whitespaceCounts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reasonPresent: { type: "boolean" },
    requiredReasonMissing: { type: "boolean" },
  },
  required: ["reasonPresent", "requiredReasonMissing"],
} as const;
/** Check an explicit record correction flag and supplied reason presence under a declared whitespace policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { correctionMade, reasonText, whitespaceCounts } = request;
  const compute = (): Output => {
    return {
      reasonPresent: whitespaceCounts
        ? reasonText.length > 0
        : reasonText.trim().length > 0,
      requiredReasonMissing:
        correctionMade &&
        !(whitespaceCounts
          ? reasonText.length > 0
          : reasonText.trim().length > 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { correctionMade: true, reasonText: " ", whitespaceCounts: false },
  output: { reasonPresent: false, requiredReasonMissing: true },
} satisfies ToolExample<Input, Output>;
export const correctionReasonPresenceFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "glp/correction-reason-presence-flag",
    title: "Correction Reason Presence Flag Tool",
    description:
      "Check an explicit record correction flag and supplied reason presence under a declared whitespace policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctionMade: { type: "boolean" },
        reasonText: { type: "string", maxLength: 8192 },
        whitespaceCounts: { type: "boolean" },
      },
      required: ["correctionMade", "reasonText", "whitespaceCounts"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reasonPresent: { type: "boolean" },
        requiredReasonMissing: { type: "boolean" },
      },
      required: ["reasonPresent", "requiredReasonMissing"],
    },
    ports: {
      inputs: [
        {
          id: "correctionMade",
          label: "Correction Made",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "reasonText",
          label: "Reason Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "whitespaceCounts",
          label: "Whitespace Counts",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "reasonPresent",
          label: "Reason Present",
          valueType: { type: "boolean" },
        },
        {
          id: "requiredReasonMissing",
          label: "Required Reason Missing",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = correctionReasonPresenceFlagTool.execute;
export default correctionReasonPresenceFlagTool;
