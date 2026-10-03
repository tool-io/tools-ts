import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly values: readonly number[] };
export type Output = {
  readonly lowerMiddle: number;
  readonly upperMiddle: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    values: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["values"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerMiddle: { type: "number" },
    upperMiddle: { type: "number" },
    gap: { type: "number" },
  },
  required: ["lowerMiddle", "upperMiddle", "gap"],
} as const;
/** Calculate median tie middle gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { values } = request;
  const compute = (): Output => {
    H.domain(values.length > 0);
    const a = [...values].sort((a, b) => a - b),
      lo = a[Math.floor((a.length - 1) / 2)],
      hi = a[Math.floor(a.length / 2)];
    return { lowerMiddle: lo, upperMiddle: hi, gap: hi - lo };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { values: [9, 1, 5, 3] },
  output: { lowerMiddle: 3, upperMiddle: 5, gap: 2 },
} satisfies ToolExample<Input, Output>;
export const medianTieMiddleGapTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "statistics/median-tie-middle-gap",
    title: "Median Tie Middle Gap Tool",
    description:
      "Calculate median tie middle gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        values: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["values"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerMiddle: { type: "number" },
        upperMiddle: { type: "number" },
        gap: { type: "number" },
      },
      required: ["lowerMiddle", "upperMiddle", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "values",
          label: "Values",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "lowerMiddle",
          label: "Lower Middle",
          valueType: { type: "number" },
        },
        {
          id: "upperMiddle",
          label: "Upper Middle",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = medianTieMiddleGapTool.execute;
export default medianTieMiddleGapTool;
