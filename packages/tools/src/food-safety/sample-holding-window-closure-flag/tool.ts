import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsed: number;
  readonly lower: number;
  readonly upper: number;
  readonly lowerIncluded: boolean;
  readonly upperIncluded: boolean;
};
export type Output = { readonly withinSuppliedWindow: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
    lowerIncluded: { type: "boolean" },
    upperIncluded: { type: "boolean" },
  },
  required: ["elapsed", "lower", "upper", "lowerIncluded", "upperIncluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { withinSuppliedWindow: { type: "boolean" } },
  required: ["withinSuppliedWindow"],
} as const;
/** Compare supplied holding time to an explicit window without selecting a food-safety limit or declaring safety. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsed, lower, upper, lowerIncluded, upperIncluded } = request;
  const compute = (): Output => {
    H.domain(lower <= upper);
    return {
      withinSuppliedWindow:
        (lowerIncluded ? elapsed >= lower : elapsed > lower) &&
        (upperIncluded ? elapsed <= upper : elapsed < upper),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    elapsed: 10,
    lower: 0,
    upper: 10,
    lowerIncluded: true,
    upperIncluded: false,
  },
  output: { withinSuppliedWindow: false },
} satisfies ToolExample<Input, Output>;
export const sampleHoldingWindowClosureFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-safety/sample-holding-window-closure-flag",
    title: "Sample Holding Window Closure Flag Tool",
    description:
      "Compare supplied holding time to an explicit window without selecting a food-safety limit or declaring safety.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number" },
        lower: { type: "number" },
        upper: { type: "number" },
        lowerIncluded: { type: "boolean" },
        upperIncluded: { type: "boolean" },
      },
      required: ["elapsed", "lower", "upper", "lowerIncluded", "upperIncluded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { withinSuppliedWindow: { type: "boolean" } },
      required: ["withinSuppliedWindow"],
    },
    ports: {
      inputs: [
        {
          id: "elapsed",
          label: "Elapsed",
          required: true,
          valueType: { type: "number" },
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
          id: "lowerIncluded",
          label: "Lower Included",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "upperIncluded",
          label: "Upper Included",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "withinSuppliedWindow",
          label: "Within Supplied Window",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = sampleHoldingWindowClosureFlagTool.execute;
export default sampleHoldingWindowClosureFlagTool;
