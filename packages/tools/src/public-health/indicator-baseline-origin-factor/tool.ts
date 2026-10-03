import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly baseline: number;
  readonly scale: number;
};
export type Output = { readonly transformed: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    baseline: { type: "number" },
    scale: { type: "number" },
  },
  required: ["value", "baseline", "scale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { transformed: { type: "number" } },
  required: ["transformed"],
} as const;
/** Apply an explicit indicator origin and nonzero scale without population inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, baseline, scale } = request;
  const compute = (): Output => {
    H.domain(scale !== 0);
    return { transformed: (value - baseline) / scale };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 12, baseline: 10, scale: 2 },
  output: { transformed: 1 },
} satisfies ToolExample<Input, Output>;
export const indicatorBaselineOriginFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-health/indicator-baseline-origin-factor",
    title: "Indicator Baseline Origin Factor Tool",
    description:
      "Apply an explicit indicator origin and nonzero scale without population inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        baseline: { type: "number" },
        scale: { type: "number" },
      },
      required: ["value", "baseline", "scale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { transformed: { type: "number" } },
      required: ["transformed"],
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
          id: "baseline",
          label: "Baseline",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scale",
          label: "Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
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
export const run = indicatorBaselineOriginFactorTool.execute;
export default indicatorBaselineOriginFactorTool;
