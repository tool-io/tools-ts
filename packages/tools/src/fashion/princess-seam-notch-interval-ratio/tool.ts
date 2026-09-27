import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstInterval: number;
  readonly secondInterval: number;
};
export type Output = { readonly ratio: number; readonly difference: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstInterval: { type: "number", minimum: 0 },
    secondInterval: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstInterval", "secondInterval"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" }, difference: { type: "number" } },
  required: ["ratio", "difference"],
} as const;
/** Calculate princess seam notch interval ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstInterval, secondInterval } = request;
  const compute = (): Output => {
    H.domain(firstInterval >= 0);
    H.positive(secondInterval);
    return {
      ratio: firstInterval / secondInterval,
      difference: firstInterval - secondInterval,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstInterval: 12, secondInterval: 10 },
  output: { ratio: 1.2, difference: 2 },
} satisfies ToolExample<Input, Output>;
export const princessSeamNotchIntervalRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/princess-seam-notch-interval-ratio",
    title: "Princess Seam Notch Interval Ratio Tool",
    description:
      "Calculate princess seam notch interval ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstInterval: { type: "number", minimum: 0 },
        secondInterval: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstInterval", "secondInterval"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" }, difference: { type: "number" } },
      required: ["ratio", "difference"],
    },
    ports: {
      inputs: [
        {
          id: "firstInterval",
          label: "First Interval",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondInterval",
          label: "Second Interval",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
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
export const run = princessSeamNotchIntervalRatioTool.execute;
export default princessSeamNotchIntervalRatioTool;
