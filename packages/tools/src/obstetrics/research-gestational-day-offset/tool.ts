import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedDay: number;
  readonly suppliedAnchorOffset: number;
  readonly targetDay: number;
};
export type Output = {
  readonly anchoredDay: number;
  readonly targetGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedDay: { type: "integer" },
    suppliedAnchorOffset: { type: "integer" },
    targetDay: { type: "integer" },
  },
  required: ["recordedDay", "suppliedAnchorOffset", "targetDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    anchoredDay: { type: "integer" },
    targetGap: { type: "integer" },
  },
  required: ["anchoredDay", "targetGap"],
} as const;
/** Apply a supplied research day-anchor offset without pregnancy dating or clinical assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedDay, suppliedAnchorOffset, targetDay } = request;
  const compute = (): Output => {
    return {
      anchoredDay: recordedDay + suppliedAnchorOffset,
      targetGap: recordedDay + suppliedAnchorOffset - targetDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedDay: 100, suppliedAnchorOffset: 14, targetDay: 110 },
  output: { anchoredDay: 114, targetGap: 4 },
} satisfies ToolExample<Input, Output>;
export const researchGestationalDayOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "obstetrics/research-gestational-day-offset",
    title: "Research Gestational Day Offset Tool",
    description:
      "Apply a supplied research day-anchor offset without pregnancy dating or clinical assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedDay: { type: "integer" },
        suppliedAnchorOffset: { type: "integer" },
        targetDay: { type: "integer" },
      },
      required: ["recordedDay", "suppliedAnchorOffset", "targetDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        anchoredDay: { type: "integer" },
        targetGap: { type: "integer" },
      },
      required: ["anchoredDay", "targetGap"],
    },
    ports: {
      inputs: [
        {
          id: "recordedDay",
          label: "Recorded Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedAnchorOffset",
          label: "Supplied Anchor Offset",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "targetDay",
          label: "Target Day",
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
        {
          id: "targetGap",
          label: "Target Gap",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchGestationalDayOffsetTool.execute;
export default researchGestationalDayOffsetTool;
