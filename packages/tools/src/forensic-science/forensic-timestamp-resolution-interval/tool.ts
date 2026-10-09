import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedTimestamp: number;
  readonly resolutionWidth: number;
};
export type Output = {
  readonly lowerInclusive: number;
  readonly upperExclusive: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedTimestamp: { type: "number" },
    resolutionWidth: { type: "number", minimum: 0 },
  },
  required: ["reportedTimestamp", "resolutionWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerInclusive: { type: "number" },
    upperExclusive: { type: "number" },
  },
  required: ["lowerInclusive", "upperExclusive"],
} as const;
/** Construct an explicit truncation-style timestamp interval [reported, reported+resolution) without inferring clock accuracy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedTimestamp, resolutionWidth } = request;
  const compute = (): Output => {
    H.domain(resolutionWidth >= 0, "resolutionWidth");
    return {
      lowerInclusive: reportedTimestamp,
      upperExclusive: reportedTimestamp + resolutionWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportedTimestamp: 100, resolutionWidth: 5 },
  output: { lowerInclusive: 100, upperExclusive: 105 },
} satisfies ToolExample<Input, Output>;
export const forensicTimestampResolutionIntervalTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "forensic-science/forensic-timestamp-resolution-interval",
      title: "Forensic Timestamp Resolution Interval Tool",
      description:
        "Construct an explicit truncation-style timestamp interval [reported, reported+resolution) without inferring clock accuracy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reportedTimestamp: { type: "number" },
          resolutionWidth: { type: "number", minimum: 0 },
        },
        required: ["reportedTimestamp", "resolutionWidth"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lowerInclusive: { type: "number" },
          upperExclusive: { type: "number" },
        },
        required: ["lowerInclusive", "upperExclusive"],
      },
      ports: {
        inputs: [
          {
            id: "reportedTimestamp",
            label: "Reported Timestamp",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "resolutionWidth",
            label: "Resolution Width",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "lowerInclusive",
            label: "Lower Inclusive",
            valueType: { type: "number" },
          },
          {
            id: "upperExclusive",
            label: "Upper Exclusive",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = forensicTimestampResolutionIntervalTool.execute;
export default forensicTimestampResolutionIntervalTool;
