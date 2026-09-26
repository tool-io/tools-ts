import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstSample: number;
  readonly firstBlank: number;
  readonly secondSample: number;
  readonly secondBlank: number;
};
export type Output = {
  readonly firstCorrected: number;
  readonly secondCorrected: number;
  readonly difference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstSample: { type: "number" },
    firstBlank: { type: "number" },
    secondSample: { type: "number" },
    secondBlank: { type: "number" },
  },
  required: ["firstSample", "firstBlank", "secondSample", "secondBlank"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCorrected: { type: "number" },
    secondCorrected: { type: "number" },
    difference: { type: "number" },
  },
  required: ["firstCorrected", "secondCorrected", "difference"],
} as const;
/** Compare two separately blank-corrected supplied observations while preserving signed results. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstSample, firstBlank, secondSample, secondBlank } = request;
  const compute = (): Output => {
    return {
      firstCorrected: firstSample - firstBlank,
      secondCorrected: secondSample - secondBlank,
      difference: firstSample - firstBlank - secondSample + secondBlank,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstSample: 10, firstBlank: 2, secondSample: 8, secondBlank: 1 },
  output: { firstCorrected: 8, secondCorrected: 7, difference: 1 },
} satisfies ToolExample<Input, Output>;
export const blankCorrectedSampleDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/blank-corrected-sample-difference",
    title: "Blank Corrected Sample Difference Tool",
    description:
      "Compare two separately blank-corrected supplied observations while preserving signed results.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstSample: { type: "number" },
        firstBlank: { type: "number" },
        secondSample: { type: "number" },
        secondBlank: { type: "number" },
      },
      required: ["firstSample", "firstBlank", "secondSample", "secondBlank"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCorrected: { type: "number" },
        secondCorrected: { type: "number" },
        difference: { type: "number" },
      },
      required: ["firstCorrected", "secondCorrected", "difference"],
    },
    ports: {
      inputs: [
        {
          id: "firstSample",
          label: "First Sample",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstBlank",
          label: "First Blank",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondSample",
          label: "Second Sample",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondBlank",
          label: "Second Blank",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstCorrected",
          label: "First Corrected",
          valueType: { type: "number" },
        },
        {
          id: "secondCorrected",
          label: "Second Corrected",
          valueType: { type: "number" },
        },
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = blankCorrectedSampleDifferenceTool.execute;
export default blankCorrectedSampleDifferenceTool;
