import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedDay: number;
  readonly referenceDay: number;
  readonly uncertaintyDays: number;
};
export type Output = {
  readonly gapDays: number;
  readonly lowerGap: number;
  readonly upperGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedDay: { type: "integer" },
    referenceDay: { type: "integer" },
    uncertaintyDays: { type: "integer", minimum: 0 },
  },
  required: ["reportedDay", "referenceDay", "uncertaintyDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gapDays: { type: "integer" },
    lowerGap: { type: "integer" },
    upperGap: { type: "integer" },
  },
  required: ["gapDays", "lowerGap", "upperGap"],
} as const;
/** Calculate caregiver recall anchor dategap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedDay, referenceDay, uncertaintyDays } = request;
  const compute = (): Output => {
    H.integer(uncertaintyDays, 0);
    return {
      gapDays: reportedDay - referenceDay,
      lowerGap: reportedDay - referenceDay - uncertaintyDays,
      upperGap: reportedDay - referenceDay + uncertaintyDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportedDay: 110, referenceDay: 100, uncertaintyDays: 3 },
  output: { gapDays: 10, lowerGap: 7, upperGap: 13 },
} satisfies ToolExample<Input, Output>;
export const caregiverRecallAnchorDategapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "child-development/caregiver-recall-anchor-dategap",
    title: "Caregiver Recall Anchor Dategap Tool",
    description:
      "Calculate caregiver recall anchor dategap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedDay: { type: "integer" },
        referenceDay: { type: "integer" },
        uncertaintyDays: { type: "integer", minimum: 0 },
      },
      required: ["reportedDay", "referenceDay", "uncertaintyDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gapDays: { type: "integer" },
        lowerGap: { type: "integer" },
        upperGap: { type: "integer" },
      },
      required: ["gapDays", "lowerGap", "upperGap"],
    },
    ports: {
      inputs: [
        {
          id: "reportedDay",
          label: "Reported Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "referenceDay",
          label: "Reference Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "uncertaintyDays",
          label: "Uncertainty Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "gapDays", label: "Gap Days", valueType: { type: "integer" } },
        { id: "lowerGap", label: "Lower Gap", valueType: { type: "integer" } },
        { id: "upperGap", label: "Upper Gap", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = caregiverRecallAnchorDategapTool.execute;
export default caregiverRecallAnchorDategapTool;
