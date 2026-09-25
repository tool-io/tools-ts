import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly featureStart: number;
  readonly featureEnd: number;
  readonly labelStart: number;
  readonly labelEnd: number;
};
export type Output = { readonly overlap: number; readonly overlaps: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    featureStart: { type: "number" },
    featureEnd: { type: "number" },
    labelStart: { type: "number" },
    labelEnd: { type: "number" },
  },
  required: ["featureStart", "featureEnd", "labelStart", "labelEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { overlap: { type: "number" }, overlaps: { type: "boolean" } },
  required: ["overlap", "overlaps"],
} as const;
/** Half-open temporal overlap audit, not a complete information-leakage detector. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { featureStart, featureEnd, labelStart, labelEnd } = request;
  const compute = (): Output => {
    H.domain(featureEnd >= featureStart && labelEnd >= labelStart);
    return {
      overlap: Math.max(
        0,
        Math.min(featureEnd, labelEnd) - Math.max(featureStart, labelStart),
      ),
      overlaps:
        Math.min(featureEnd, labelEnd) > Math.max(featureStart, labelStart),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { featureStart: 0, featureEnd: 10, labelStart: 8, labelEnd: 20 },
  output: { overlap: 2, overlaps: true },
} satisfies ToolExample<Input, Output>;
export const featureLabelTimeWindowOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/feature-label-time-window-overlap",
    title: "Feature Label Time Window Overlap Tool",
    description:
      "Half-open temporal overlap audit, not a complete information-leakage detector.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        featureStart: { type: "number" },
        featureEnd: { type: "number" },
        labelStart: { type: "number" },
        labelEnd: { type: "number" },
      },
      required: ["featureStart", "featureEnd", "labelStart", "labelEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlap: { type: "number" },
        overlaps: { type: "boolean" },
      },
      required: ["overlap", "overlaps"],
    },
    ports: {
      inputs: [
        {
          id: "featureStart",
          label: "Feature Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "featureEnd",
          label: "Feature End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "labelStart",
          label: "Label Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "labelEnd",
          label: "Label End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "overlap", label: "Overlap", valueType: { type: "number" } },
        { id: "overlaps", label: "Overlaps", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = featureLabelTimeWindowOverlapTool.execute;
export default featureLabelTimeWindowOverlapTool;
