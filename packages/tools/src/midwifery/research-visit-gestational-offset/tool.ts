import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedDayIndex: number;
  readonly suppliedAnchorCorrection: number;
  readonly plannedResearchDay: number;
};
export type Output = {
  readonly anchoredDay: number;
  readonly deviation: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedDayIndex: { type: "integer" },
    suppliedAnchorCorrection: { type: "integer" },
    plannedResearchDay: { type: "integer" },
  },
  required: [
    "suppliedDayIndex",
    "suppliedAnchorCorrection",
    "plannedResearchDay",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    anchoredDay: { type: "integer" },
    deviation: { type: "integer" },
  },
  required: ["anchoredDay", "deviation"],
} as const;
/** Compare supplied research day anchors without pregnancy dating, care scheduling or clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedDayIndex, suppliedAnchorCorrection, plannedResearchDay } =
    request;
  const compute = (): Output => {
    return {
      anchoredDay: suppliedDayIndex + suppliedAnchorCorrection,
      deviation:
        suppliedDayIndex + suppliedAnchorCorrection - plannedResearchDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    suppliedDayIndex: 100,
    suppliedAnchorCorrection: 14,
    plannedResearchDay: 110,
  },
  output: { anchoredDay: 114, deviation: 4 },
} satisfies ToolExample<Input, Output>;
export const researchVisitGestationalOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "midwifery/research-visit-gestational-offset",
    title: "Research Visit Gestational Offset Tool",
    description:
      "Compare supplied research day anchors without pregnancy dating, care scheduling or clinical interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedDayIndex: { type: "integer" },
        suppliedAnchorCorrection: { type: "integer" },
        plannedResearchDay: { type: "integer" },
      },
      required: [
        "suppliedDayIndex",
        "suppliedAnchorCorrection",
        "plannedResearchDay",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        anchoredDay: { type: "integer" },
        deviation: { type: "integer" },
      },
      required: ["anchoredDay", "deviation"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedDayIndex",
          label: "Supplied Day Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedAnchorCorrection",
          label: "Supplied Anchor Correction",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "plannedResearchDay",
          label: "Planned Research Day",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "anchoredDay",
          label: "Anchored Day",
          valueType: { type: "integer" },
        },
        { id: "deviation", label: "Deviation", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = researchVisitGestationalOffsetTool.execute;
export default researchVisitGestationalOffsetTool;
