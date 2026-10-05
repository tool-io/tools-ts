import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredDimensions: readonly number[];
  readonly maximumDimensions: readonly number[];
};
export type Output = {
  readonly margins: readonly number[];
  readonly withinAllLimits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredDimensions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    maximumDimensions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["measuredDimensions", "maximumDimensions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    margins: { type: "array", maxItems: 256, items: { type: "number" } },
    withinAllLimits: { type: "boolean" },
  },
  required: ["margins", "withinAllLimits"],
} as const;
/** Compare explicitly aligned luggage dimensions with caller-supplied inclusive limits; no airline policy or rotation allowance is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredDimensions, maximumDimensions } = request;
  const compute = (): Output => {
    H.sameLength(measuredDimensions, maximumDimensions);
    H.domain(measuredDimensions.length > 0, "measuredDimensions");
    measuredDimensions.forEach((v) => H.domain(v >= 0, "measuredDimensions"));
    maximumDimensions.forEach((v) => H.domain(v >= 0, "measuredDimensions"));
    const margins = maximumDimensions.map((v, i) => v - measuredDimensions[i]);
    return { margins, withinAllLimits: margins.every((v) => v >= 0) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredDimensions: [55, 35, 20], maximumDimensions: [55, 40, 23] },
  output: { margins: [0, 5, 3], withinAllLimits: true },
} satisfies ToolExample<Input, Output>;
export const luggageDimensionLimitMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "tourism/luggage-dimension-limit-margin",
    title: "Luggage Dimension Limit Margin Tool",
    description:
      "Compare explicitly aligned luggage dimensions with caller-supplied inclusive limits; no airline policy or rotation allowance is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredDimensions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        maximumDimensions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["measuredDimensions", "maximumDimensions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        margins: { type: "array", maxItems: 256, items: { type: "number" } },
        withinAllLimits: { type: "boolean" },
      },
      required: ["margins", "withinAllLimits"],
    },
    ports: {
      inputs: [
        {
          id: "measuredDimensions",
          label: "Measured Dimensions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "maximumDimensions",
          label: "Maximum Dimensions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "margins",
          label: "Margins",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "withinAllLimits",
          label: "Within All Limits",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = luggageDimensionLimitMarginTool.execute;
export default luggageDimensionLimitMarginTool;
