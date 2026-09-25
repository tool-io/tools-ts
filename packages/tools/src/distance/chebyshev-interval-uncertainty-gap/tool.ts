import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLower: readonly number[];
  readonly firstUpper: readonly number[];
  readonly secondLower: readonly number[];
  readonly secondUpper: readonly number[];
};
export type Output = { readonly distance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLower: { type: "array", maxItems: 256, items: { type: "number" } },
    firstUpper: { type: "array", maxItems: 256, items: { type: "number" } },
    secondLower: { type: "array", maxItems: 256, items: { type: "number" } },
    secondUpper: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["firstLower", "firstUpper", "secondLower", "secondUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distance: { type: "number" } },
  required: ["distance"],
} as const;
/** Calculate chebyshev interval uncertainty gap from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { firstLower, firstUpper, secondLower, secondUpper } = input;
  const compute = (): Output => {
    H.sameLength(firstLower, firstUpper);
    H.sameLength(firstLower, secondLower);
    H.sameLength(firstLower, secondUpper);
    H.domain(
      firstLower.length > 0 &&
        firstLower.every(
          (x, i) => x <= firstUpper[i] && secondLower[i] <= secondUpper[i],
        ),
    );
    return {
      distance: Math.max(
        ...firstLower.map((x, i) =>
          Math.max(0, x - secondUpper[i], secondLower[i] - firstUpper[i]),
        ),
      ),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    firstLower: [0, 0],
    firstUpper: [2, 2],
    secondLower: [3, 1],
    secondUpper: [4, 3],
  },
  output: { distance: 1 },
} satisfies ToolExample<Input, Output>;
export const chebyshevIntervalUncertaintyGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/chebyshev-interval-uncertainty-gap",
    title: "Chebyshev Interval Uncertainty Gap Tool",
    description:
      "Calculate chebyshev interval uncertainty gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLower: { type: "array", maxItems: 256, items: { type: "number" } },
        firstUpper: { type: "array", maxItems: 256, items: { type: "number" } },
        secondLower: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        secondUpper: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["firstLower", "firstUpper", "secondLower", "secondUpper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { distance: { type: "number" } },
      required: ["distance"],
    },
    ports: {
      inputs: [
        {
          id: "firstLower",
          label: "First Lower",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "firstUpper",
          label: "First Upper",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "secondLower",
          label: "Second Lower",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "secondUpper",
          label: "Second Upper",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "distance", label: "Distance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = chebyshevIntervalUncertaintyGapTool.execute;
export default chebyshevIntervalUncertaintyGapTool;
