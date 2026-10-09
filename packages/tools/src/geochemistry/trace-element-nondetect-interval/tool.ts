import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly detectionLimit: number;
  readonly lowerBound: number;
  readonly upperIncluded: boolean;
};
export type Output = {
  readonly lower: number;
  readonly upper: number;
  readonly includesUpper: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    detectionLimit: { type: "number" },
    lowerBound: { type: "number", minimum: 0 },
    upperIncluded: { type: "boolean" },
  },
  required: ["detectionLimit", "lowerBound", "upperIncluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number" },
    upper: { type: "number" },
    includesUpper: { type: "boolean" },
  },
  required: ["lower", "upper", "includesUpper"],
} as const;
/** Return an explicitly supplied nondetect interval without substituting a concentration estimate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { detectionLimit, lowerBound, upperIncluded } = request;
  const compute = (): Output => {
    H.domain(lowerBound >= 0 && detectionLimit >= lowerBound, "lowerBound");
    return {
      lower: lowerBound,
      upper: detectionLimit,
      includesUpper: upperIncluded,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { detectionLimit: 0.5, lowerBound: 0, upperIncluded: false },
  output: { lower: 0, upper: 0.5, includesUpper: false },
} satisfies ToolExample<Input, Output>;
export const traceElementNondetectIntervalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geochemistry", "chemistry"],
      keywords: ["geochemistry", "chemistry"],
    },
    id: "geochemistry/trace-element-nondetect-interval",
    title: "Trace Element Nondetect Interval",
    description:
      "Return an explicitly supplied nondetect interval without substituting a concentration estimate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        detectionLimit: { type: "number" },
        lowerBound: { type: "number", minimum: 0 },
        upperIncluded: { type: "boolean" },
      },
      required: ["detectionLimit", "lowerBound", "upperIncluded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lower: { type: "number" },
        upper: { type: "number" },
        includesUpper: { type: "boolean" },
      },
      required: ["lower", "upper", "includesUpper"],
    },
    ports: {
      inputs: [
        {
          id: "detectionLimit",
          label: "Detection Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerBound",
          label: "Lower Bound",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperIncluded",
          label: "Upper Included",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "lower", label: "Lower", valueType: { type: "number" } },
        { id: "upper", label: "Upper", valueType: { type: "number" } },
        {
          id: "includesUpper",
          label: "Includes Upper",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = traceElementNondetectIntervalTool.execute;
export default traceElementNondetectIntervalTool;
