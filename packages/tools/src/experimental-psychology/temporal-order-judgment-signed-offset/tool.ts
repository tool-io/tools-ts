import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstOnset: number;
  readonly secondOnset: number;
  readonly referenceOffset: number;
};
export type Output = {
  readonly stimulusOnsetAsynchrony: number;
  readonly referenceCentered: number;
  readonly firstPrecedes: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstOnset: { type: "number" },
    secondOnset: { type: "number" },
    referenceOffset: { type: "number" },
  },
  required: ["firstOnset", "secondOnset", "referenceOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stimulusOnsetAsynchrony: { type: "number" },
    referenceCentered: { type: "number" },
    firstPrecedes: { type: "boolean" },
  },
  required: ["stimulusOnsetAsynchrony", "referenceCentered", "firstPrecedes"],
} as const;
/** Calculate temporal order judgment signed offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstOnset, secondOnset, referenceOffset } = request;
  const compute = (): Output => {
    return {
      stimulusOnsetAsynchrony: secondOnset - firstOnset,
      referenceCentered: secondOnset - firstOnset - referenceOffset,
      firstPrecedes: firstOnset < secondOnset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstOnset: 100, secondOnset: 140, referenceOffset: 10 },
  output: {
    stimulusOnsetAsynchrony: 40,
    referenceCentered: 30,
    firstPrecedes: true,
  },
} satisfies ToolExample<Input, Output>;
export const temporalOrderJudgmentSignedOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/temporal-order-judgment-signed-offset",
    title: "Temporal Order Judgment Signed Offset Tool",
    description:
      "Calculate temporal order judgment signed offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstOnset: { type: "number" },
        secondOnset: { type: "number" },
        referenceOffset: { type: "number" },
      },
      required: ["firstOnset", "secondOnset", "referenceOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stimulusOnsetAsynchrony: { type: "number" },
        referenceCentered: { type: "number" },
        firstPrecedes: { type: "boolean" },
      },
      required: [
        "stimulusOnsetAsynchrony",
        "referenceCentered",
        "firstPrecedes",
      ],
    },
    ports: {
      inputs: [
        {
          id: "firstOnset",
          label: "First Onset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondOnset",
          label: "Second Onset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceOffset",
          label: "Reference Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "stimulusOnsetAsynchrony",
          label: "Stimulus Onset Asynchrony",
          valueType: { type: "number" },
        },
        {
          id: "referenceCentered",
          label: "Reference Centered",
          valueType: { type: "number" },
        },
        {
          id: "firstPrecedes",
          label: "First Precedes",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = temporalOrderJudgmentSignedOffsetTool.execute;
export default temporalOrderJudgmentSignedOffsetTool;
