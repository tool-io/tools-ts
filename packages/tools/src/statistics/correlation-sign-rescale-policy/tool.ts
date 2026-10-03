import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly correlation: number;
  readonly firstScale: number;
  readonly secondScale: number;
};
export type Output = {
  readonly defined: boolean;
  readonly transformed: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correlation: { type: "number" },
    firstScale: { type: "number" },
    secondScale: { type: "number" },
  },
  required: ["correlation", "firstScale", "secondScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { defined: { type: "boolean" }, transformed: { type: "number" } },
  required: ["defined", "transformed"],
} as const;
/** Correlation under nonzero linear rescaling; a collapsed variable returns an undefined flag and zero placeholder. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { correlation, firstScale, secondScale } = request;
  const compute = (): Output => {
    H.domain(Math.abs(correlation) <= 1);
    const defined = firstScale !== 0 && secondScale !== 0;
    return {
      defined,
      transformed: defined
        ? correlation * Math.sign(firstScale) * Math.sign(secondScale)
        : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { correlation: 0.6, firstScale: -2, secondScale: 3 },
  output: { defined: true, transformed: -0.6 },
} satisfies ToolExample<Input, Output>;
export const correlationSignRescalePolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/correlation-sign-rescale-policy",
    title: "Correlation Sign Rescale Policy Tool",
    description:
      "Correlation under nonzero linear rescaling; a collapsed variable returns an undefined flag and zero placeholder.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correlation: { type: "number" },
        firstScale: { type: "number" },
        secondScale: { type: "number" },
      },
      required: ["correlation", "firstScale", "secondScale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        defined: { type: "boolean" },
        transformed: { type: "number" },
      },
      required: ["defined", "transformed"],
    },
    ports: {
      inputs: [
        {
          id: "correlation",
          label: "Correlation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstScale",
          label: "First Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondScale",
          label: "Second Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        {
          id: "transformed",
          label: "Transformed",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = correlationSignRescalePolicyTool.execute;
export default correlationSignRescalePolicyTool;
