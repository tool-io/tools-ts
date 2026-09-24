import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signal: number;
  readonly slope: number;
  readonly intercept: number;
  readonly referenceSignal: number;
};
export type Output = {
  readonly value: number;
  readonly referenceValue: number;
  readonly difference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signal: { type: "number" },
    slope: { type: "number" },
    intercept: { type: "number" },
    referenceSignal: { type: "number" },
  },
  required: ["signal", "slope", "intercept", "referenceSignal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    referenceValue: { type: "number" },
    difference: { type: "number" },
  },
  required: ["value", "referenceValue", "difference"],
} as const;
/** Evaluate an explicitly supplied linear cold-wire calibration without extrapolation or material validity claims. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signal, slope, intercept, referenceSignal } = request;
  const compute = (): Output => {
    return {
      value: slope * signal + intercept,
      referenceValue: slope * referenceSignal + intercept,
      difference: slope * (signal - referenceSignal),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signal: 2, slope: 3, intercept: 10, referenceSignal: 1 },
  output: { value: 16, referenceValue: 13, difference: 3 },
} satisfies ToolExample<Input, Output>;
export const coldWireReferenceInterceptTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cryogenics/cold-wire-reference-intercept-token",
    title: "Cold Wire Reference Intercept Token Tool",
    description:
      "Evaluate an explicitly supplied linear cold-wire calibration without extrapolation or material validity claims.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signal: { type: "number" },
        slope: { type: "number" },
        intercept: { type: "number" },
        referenceSignal: { type: "number" },
      },
      required: ["signal", "slope", "intercept", "referenceSignal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        referenceValue: { type: "number" },
        difference: { type: "number" },
      },
      required: ["value", "referenceValue", "difference"],
    },
    ports: {
      inputs: [
        {
          id: "signal",
          label: "Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "slope",
          label: "Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "intercept",
          label: "Intercept",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceSignal",
          label: "Reference Signal",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "value", label: "Value", valueType: { type: "number" } },
        {
          id: "referenceValue",
          label: "Reference Value",
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
export const run = coldWireReferenceInterceptTokenTool.execute;
export default coldWireReferenceInterceptTokenTool;
