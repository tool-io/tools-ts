import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly ratio: number; readonly firstOmitted: number };
export type Output = { readonly tail: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" }, firstOmitted: { type: "number" } },
  required: ["ratio", "firstOmitted"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tail: { type: "number" } },
  required: ["tail"],
} as const;
/** Calculate geometric partial sum tail ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ratio, firstOmitted } = request;
  const compute = (): Output => {
    H.domain(Math.abs(ratio) < 1);
    return { tail: firstOmitted / (1 - ratio) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ratio: 0.5, firstOmitted: 0.125 },
  output: { tail: 0.25 },
} satisfies ToolExample<Input, Output>;
export const geometricPartialSumTailRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/geometric-partial-sum-tail-ratio",
    title: "Geometric Partial Sum Tail Ratio Tool",
    description:
      "Calculate geometric partial sum tail ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ratio: { type: "number" },
        firstOmitted: { type: "number" },
      },
      required: ["ratio", "firstOmitted"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tail: { type: "number" } },
      required: ["tail"],
    },
    ports: {
      inputs: [
        {
          id: "ratio",
          label: "Ratio",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstOmitted",
          label: "First Omitted",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "tail", label: "Tail", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = geometricPartialSumTailRatioTool.execute;
export default geometricPartialSumTailRatioTool;
