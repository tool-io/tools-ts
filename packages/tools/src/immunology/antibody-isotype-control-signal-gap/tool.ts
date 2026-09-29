import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleSignal: number;
  readonly controlSignal: number;
  readonly controlSd: number;
};
export type Output = {
  readonly difference: number;
  readonly standardizedDifference: number;
  readonly ratio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleSignal: { type: "number" },
    controlSignal: { type: "number", exclusiveMinimum: 0 },
    controlSd: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sampleSignal", "controlSignal", "controlSd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    difference: { type: "number" },
    standardizedDifference: { type: "number" },
    ratio: { type: "number" },
  },
  required: ["difference", "standardizedDifference", "ratio"],
} as const;
/** Descriptive isotype-control comparisons without choosing a positivity gate or concluding binding specificity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleSignal, controlSignal, controlSd } = request;
  const compute = (): Output => {
    H.positive(controlSignal);
    H.positive(controlSd);
    return {
      difference: sampleSignal - controlSignal,
      standardizedDifference: (sampleSignal - controlSignal) / controlSd,
      ratio: sampleSignal / controlSignal,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleSignal: 150, controlSignal: 100, controlSd: 25 },
  output: { difference: 50, standardizedDifference: 2, ratio: 1.5 },
} satisfies ToolExample<Input, Output>;
export const antibodyIsotypeControlSignalGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "immunology/antibody-isotype-control-signal-gap",
    title: "Antibody Isotype Control Signal Gap Tool",
    description:
      "Descriptive isotype-control comparisons without choosing a positivity gate or concluding binding specificity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleSignal: { type: "number" },
        controlSignal: { type: "number", exclusiveMinimum: 0 },
        controlSd: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["sampleSignal", "controlSignal", "controlSd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        difference: { type: "number" },
        standardizedDifference: { type: "number" },
        ratio: { type: "number" },
      },
      required: ["difference", "standardizedDifference", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "sampleSignal",
          label: "Sample Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "controlSignal",
          label: "Control Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "controlSd",
          label: "Control Sd",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
        {
          id: "standardizedDifference",
          label: "Standardized Difference",
          valueType: { type: "number" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = antibodyIsotypeControlSignalGapTool.execute;
export default antibodyIsotypeControlSignalGapTool;
