import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedVisibleFraction: number;
  readonly recordedSeconds: number;
  readonly suppliedMinimumFraction: number;
  readonly suppliedMinimumSeconds: number;
};
export type Output = { readonly meetsSuppliedThresholds: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedVisibleFraction: { type: "number", minimum: 0, maximum: 1 },
    recordedSeconds: { type: "number", minimum: 0 },
    suppliedMinimumFraction: { type: "number", minimum: 0, maximum: 1 },
    suppliedMinimumSeconds: { type: "number", minimum: 0 },
  },
  required: [
    "recordedVisibleFraction",
    "recordedSeconds",
    "suppliedMinimumFraction",
    "suppliedMinimumSeconds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { meetsSuppliedThresholds: { type: "boolean" } },
  required: ["meetsSuppliedThresholds"],
} as const;
/** Compare explicit viewability observations with supplied fraction and duration thresholds without selecting an advertising standard. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    recordedVisibleFraction,
    recordedSeconds,
    suppliedMinimumFraction,
    suppliedMinimumSeconds,
  } = request;
  const compute = (): Output => {
    (H.domain(
      recordedVisibleFraction >= 0 && recordedVisibleFraction <= 1,
      "recordedVisibleFraction",
    ),
      recordedVisibleFraction);
    (H.domain(
      suppliedMinimumFraction >= 0 && suppliedMinimumFraction <= 1,
      "suppliedMinimumFraction",
    ),
      suppliedMinimumFraction);
    H.domain(
      recordedSeconds >= 0 && suppliedMinimumSeconds >= 0,
      "recordedSeconds",
    );
    return {
      meetsSuppliedThresholds:
        recordedVisibleFraction >= suppliedMinimumFraction &&
        recordedSeconds >= suppliedMinimumSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordedVisibleFraction: 0.6,
    recordedSeconds: 3,
    suppliedMinimumFraction: 0.5,
    suppliedMinimumSeconds: 2,
  },
  output: { meetsSuppliedThresholds: true },
} satisfies ToolExample<Input, Output>;
export const impressionViewabilitySourceThresholdTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["advertising", "business and finance"],
        keywords: ["advertising", "business and finance"],
      },
      id: "advertising/impression-viewability-source-threshold",
      title: "Impression Viewability Source Threshold",
      description:
        "Compare explicit viewability observations with supplied fraction and duration thresholds without selecting an advertising standard.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordedVisibleFraction: { type: "number", minimum: 0, maximum: 1 },
          recordedSeconds: { type: "number", minimum: 0 },
          suppliedMinimumFraction: { type: "number", minimum: 0, maximum: 1 },
          suppliedMinimumSeconds: { type: "number", minimum: 0 },
        },
        required: [
          "recordedVisibleFraction",
          "recordedSeconds",
          "suppliedMinimumFraction",
          "suppliedMinimumSeconds",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { meetsSuppliedThresholds: { type: "boolean" } },
        required: ["meetsSuppliedThresholds"],
      },
      ports: {
        inputs: [
          {
            id: "recordedVisibleFraction",
            label: "Recorded Visible Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "recordedSeconds",
            label: "Recorded Seconds",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedMinimumFraction",
            label: "Supplied Minimum Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedMinimumSeconds",
            label: "Supplied Minimum Seconds",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "meetsSuppliedThresholds",
            label: "Meets Supplied Thresholds",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = impressionViewabilitySourceThresholdTool.execute;
export default impressionViewabilitySourceThresholdTool;
