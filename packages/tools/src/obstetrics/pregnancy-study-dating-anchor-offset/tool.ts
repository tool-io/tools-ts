import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstAnchorDay: number;
  readonly secondAnchorDay: number;
  readonly observationDay: number;
};
export type Output = {
  readonly anchorDifferenceDays: number;
  readonly firstRelativeDay: number;
  readonly secondRelativeDay: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAnchorDay: { type: "integer" },
    secondAnchorDay: { type: "integer" },
    observationDay: { type: "integer" },
  },
  required: ["firstAnchorDay", "secondAnchorDay", "observationDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    anchorDifferenceDays: { type: "integer" },
    firstRelativeDay: { type: "integer" },
    secondRelativeDay: { type: "integer" },
  },
  required: ["anchorDifferenceDays", "firstRelativeDay", "secondRelativeDay"],
} as const;
/** Compare supplied dating anchors on a common research day index. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstAnchorDay, secondAnchorDay, observationDay } = request;
  const compute = (): Output => {
    return {
      anchorDifferenceDays: secondAnchorDay - firstAnchorDay,
      firstRelativeDay: observationDay - firstAnchorDay,
      secondRelativeDay: observationDay - secondAnchorDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstAnchorDay: 100, secondAnchorDay: 103, observationDay: 190 },
  output: {
    anchorDifferenceDays: 3,
    firstRelativeDay: 90,
    secondRelativeDay: 87,
  },
} satisfies ToolExample<Input, Output>;
export const pregnancyStudyDatingAnchorOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "obstetrics/pregnancy-study-dating-anchor-offset",
    title: "Pregnancy Study Dating Anchor Offset Tool",
    description:
      "Compare supplied dating anchors on a common research day index.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstAnchorDay: { type: "integer" },
        secondAnchorDay: { type: "integer" },
        observationDay: { type: "integer" },
      },
      required: ["firstAnchorDay", "secondAnchorDay", "observationDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        anchorDifferenceDays: { type: "integer" },
        firstRelativeDay: { type: "integer" },
        secondRelativeDay: { type: "integer" },
      },
      required: [
        "anchorDifferenceDays",
        "firstRelativeDay",
        "secondRelativeDay",
      ],
    },
    ports: {
      inputs: [
        {
          id: "firstAnchorDay",
          label: "First Anchor Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondAnchorDay",
          label: "Second Anchor Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observationDay",
          label: "Observation Day",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "anchorDifferenceDays",
          label: "Anchor Difference Days",
          valueType: { type: "integer" },
        },
        {
          id: "firstRelativeDay",
          label: "First Relative Day",
          valueType: { type: "integer" },
        },
        {
          id: "secondRelativeDay",
          label: "Second Relative Day",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = pregnancyStudyDatingAnchorOffsetTool.execute;
export default pregnancyStudyDatingAnchorOffsetTool;
