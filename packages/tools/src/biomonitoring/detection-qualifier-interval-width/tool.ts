import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lower: number;
  readonly upper: number;
  readonly lowerIncluded: boolean;
  readonly upperIncluded: boolean;
};
export type Output = {
  readonly width: number;
  readonly lowerClosed: boolean;
  readonly upperClosed: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number" },
    upper: { type: "number" },
    lowerIncluded: { type: "boolean" },
    upperIncluded: { type: "boolean" },
  },
  required: ["lower", "upper", "lowerIncluded", "upperIncluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number" },
    lowerClosed: { type: "boolean" },
    upperClosed: { type: "boolean" },
  },
  required: ["width", "lowerClosed", "upperClosed"],
} as const;
/** Measure an explicit finite censored-result interval while preserving endpoint membership. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lower, upper, lowerIncluded, upperIncluded } = request;
  const compute = (): Output => {
    H.domain(
      upper >= lower && (upper > lower || (lowerIncluded && upperIncluded)),
    );
    return {
      width: upper - lower,
      lowerClosed: lowerIncluded,
      upperClosed: upperIncluded,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lower: 0, upper: 2, lowerIncluded: true, upperIncluded: false },
  output: { width: 2, lowerClosed: true, upperClosed: false },
} satisfies ToolExample<Input, Output>;
export const detectionQualifierIntervalWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomonitoring/detection-qualifier-interval-width",
    title: "Detection Qualifier Interval Width Tool",
    description:
      "Measure an explicit finite censored-result interval while preserving endpoint membership.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lower: { type: "number" },
        upper: { type: "number" },
        lowerIncluded: { type: "boolean" },
        upperIncluded: { type: "boolean" },
      },
      required: ["lower", "upper", "lowerIncluded", "upperIncluded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number" },
        lowerClosed: { type: "boolean" },
        upperClosed: { type: "boolean" },
      },
      required: ["width", "lowerClosed", "upperClosed"],
    },
    ports: {
      inputs: [
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
        { id: "width", label: "Width", valueType: { type: "number" } },
        {
          id: "lowerClosed",
          label: "Lower Closed",
          valueType: { type: "boolean" },
        },
        {
          id: "upperClosed",
          label: "Upper Closed",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = detectionQualifierIntervalWidthTool.execute;
export default detectionQualifierIntervalWidthTool;
