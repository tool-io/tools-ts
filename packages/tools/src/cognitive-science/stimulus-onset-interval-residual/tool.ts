import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstOnset: number;
  readonly secondOnset: number;
  readonly suppliedTargetInterval: number;
};
export type Output = {
  readonly observedInterval: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstOnset: { type: "number" },
    secondOnset: { type: "number" },
    suppliedTargetInterval: { type: "number" },
  },
  required: ["firstOnset", "secondOnset", "suppliedTargetInterval"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedInterval: { type: "number" },
    residual: { type: "number" },
  },
  required: ["observedInterval", "residual"],
} as const;
/** Compare explicitly supplied research stimulus timing without perception or cognition inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstOnset, secondOnset, suppliedTargetInterval } = request;
  const compute = (): Output => {
    return {
      observedInterval: secondOnset - firstOnset,
      residual: secondOnset - firstOnset - suppliedTargetInterval,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstOnset: 100, secondOnset: 130, suppliedTargetInterval: 25 },
  output: { observedInterval: 30, residual: 5 },
} satisfies ToolExample<Input, Output>;
export const stimulusOnsetIntervalResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cognitive-science/stimulus-onset-interval-residual",
    title: "Stimulus Onset Interval Residual Tool",
    description:
      "Compare explicitly supplied research stimulus timing without perception or cognition inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstOnset: { type: "number" },
        secondOnset: { type: "number" },
        suppliedTargetInterval: { type: "number" },
      },
      required: ["firstOnset", "secondOnset", "suppliedTargetInterval"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedInterval: { type: "number" },
        residual: { type: "number" },
      },
      required: ["observedInterval", "residual"],
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
          id: "suppliedTargetInterval",
          label: "Supplied Target Interval",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "observedInterval",
          label: "Observed Interval",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = stimulusOnsetIntervalResidualTool.execute;
export default stimulusOnsetIntervalResidualTool;
