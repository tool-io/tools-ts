import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sizes: readonly number[];
  readonly lower: number;
  readonly upper: number;
  readonly lowerClosed: boolean;
  readonly upperClosed: boolean;
};
export type Output = { readonly selectedPositions: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sizes: { type: "array", maxItems: 256, items: { type: "number" } },
    lower: { type: "number" },
    upper: { type: "number" },
    lowerClosed: { type: "boolean" },
    upperClosed: { type: "boolean" },
  },
  required: ["sizes", "lower", "upper", "lowerClosed", "upperClosed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selectedPositions: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["selectedPositions"],
} as const;
/** Apply supplied sieve-bin endpoint conventions without selecting a manufacturing specification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sizes, lower, upper, lowerClosed, upperClosed } = request;
  const compute = (): Output => {
    H.domain(lower < upper);
    return {
      selectedPositions: sizes.flatMap((x, i) =>
        (lowerClosed ? x >= lower : x > lower) &&
        (upperClosed ? x <= upper : x < upper)
          ? [i]
          : [],
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sizes: [1, 2, 3],
    lower: 1,
    upper: 3,
    lowerClosed: true,
    upperClosed: false,
  },
  output: { selectedPositions: [0, 1] },
} satisfies ToolExample<Input, Output>;
export const granuleSieveEdgePolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-pharmacy/granule-sieve-edge-policy",
    title: "Granule Sieve Edge Policy Tool",
    description:
      "Apply supplied sieve-bin endpoint conventions without selecting a manufacturing specification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sizes: { type: "array", maxItems: 256, items: { type: "number" } },
        lower: { type: "number" },
        upper: { type: "number" },
        lowerClosed: { type: "boolean" },
        upperClosed: { type: "boolean" },
      },
      required: ["sizes", "lower", "upper", "lowerClosed", "upperClosed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        selectedPositions: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["selectedPositions"],
    },
    ports: {
      inputs: [
        {
          id: "sizes",
          label: "Sizes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "lower",
          label: "Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upper",
          label: "Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerClosed",
          label: "Lower Closed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "upperClosed",
          label: "Upper Closed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "selectedPositions",
          label: "Selected Positions",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = granuleSieveEdgePolicyTool.execute;
export default granuleSieveEdgePolicyTool;
