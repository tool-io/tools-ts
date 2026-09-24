import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly reference: number;
  readonly logBase: number;
};
export type Output = { readonly logRatio: number; readonly sign: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number", exclusiveMinimum: 0 },
    reference: { type: "number", exclusiveMinimum: 0 },
    logBase: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["value", "reference", "logBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { logRatio: { type: "number" }, sign: { type: "integer" } },
  required: ["logRatio", "sign"],
} as const;
/** Compare a positive supplied ratio to its reference in an explicit logarithm base, including bases below one. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, reference, logBase } = request;
  const compute = (): Output => {
    H.positive(value);
    H.positive(reference);
    H.domain(logBase > 0 && logBase !== 1);
    return {
      logRatio: (Math.log(value) - Math.log(reference)) / Math.log(logBase),
      sign: Math.sign((value - reference) / Math.log(logBase)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 4, reference: 2, logBase: 2 },
  output: { logRatio: 1, sign: 1 },
} satisfies ToolExample<Input, Output>;
export const logRatioReferenceSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "convert/log-ratio-reference-sign",
    title: "Log Ratio Reference Sign Tool",
    description:
      "Compare a positive supplied ratio to its reference in an explicit logarithm base, including bases below one.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number", exclusiveMinimum: 0 },
        reference: { type: "number", exclusiveMinimum: 0 },
        logBase: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["value", "reference", "logBase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { logRatio: { type: "number" }, sign: { type: "integer" } },
      required: ["logRatio", "sign"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "logBase",
          label: "Log Base",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "logRatio", label: "Log Ratio", valueType: { type: "number" } },
        { id: "sign", label: "Sign", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = logRatioReferenceSignTool.execute;
export default logRatioReferenceSignTool;
