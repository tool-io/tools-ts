import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly firstOmitted: number;
  readonly absoluteRatio: number;
};
export type Output = { readonly absoluteTailBound: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstOmitted: { type: "number" },
    absoluteRatio: { type: "number" },
  },
  required: ["firstOmitted", "absoluteRatio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { absoluteTailBound: { type: "number" } },
  required: ["absoluteTailBound"],
} as const;
/** Compute geometric series single tail bound from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { firstOmitted, absoluteRatio } = input;
  const compute = (): Output => {
    domain(absoluteRatio >= 0 && absoluteRatio < 1);
    return { absoluteTailBound: Math.abs(firstOmitted) / (1 - absoluteRatio) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { firstOmitted: 2, absoluteRatio: 0.5 },
  output: { absoluteTailBound: 4 },
} satisfies ToolExample<Input, Output>;
export const geometricSeriesSingleTailBoundTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "sequence/geometric-series-single-tail-bound",
  title: "Geometric Series Single Tail Bound Tool",
  description:
    "Compute geometric series single tail bound from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "firstOmitted",
        label: "First Omitted",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "absoluteRatio",
        label: "Absolute Ratio",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      {
        id: "absoluteTailBound",
        label: "Absolute Tail Bound",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = geometricSeriesSingleTailBoundTool.execute;
export default geometricSeriesSingleTailBoundTool;
