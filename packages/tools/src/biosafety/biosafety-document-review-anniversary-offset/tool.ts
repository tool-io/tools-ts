import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lastReviewDay: number;
  readonly intervalDays: number;
  readonly actualReviewDay: number;
};
export type Output = {
  readonly nominalDay: number;
  readonly deviationDays: number;
  readonly early: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lastReviewDay: { type: "integer" },
    intervalDays: { type: "integer", minimum: 1 },
    actualReviewDay: { type: "integer" },
  },
  required: ["lastReviewDay", "intervalDays", "actualReviewDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalDay: { type: "integer" },
    deviationDays: { type: "integer" },
    early: { type: "boolean" },
  },
  required: ["nominalDay", "deviationDays", "early"],
} as const;
/** Compare a supplied review against an explicit day-count anniversary interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lastReviewDay, intervalDays, actualReviewDay } = request;
  const compute = (): Output => {
    H.integer(intervalDays, 1);
    H.domain(actualReviewDay >= lastReviewDay);
    return {
      nominalDay: lastReviewDay + intervalDays,
      deviationDays: actualReviewDay - lastReviewDay - intervalDays,
      early: actualReviewDay < lastReviewDay + intervalDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lastReviewDay: 100, intervalDays: 365, actualReviewDay: 470 },
  output: { nominalDay: 465, deviationDays: 5, early: false },
} satisfies ToolExample<Input, Output>;
export const biosafetyDocumentReviewAnniversaryOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosafety/biosafety-document-review-anniversary-offset",
      title: "Biosafety Document Review Anniversary Offset Tool",
      description:
        "Compare a supplied review against an explicit day-count anniversary interval.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lastReviewDay: { type: "integer" },
          intervalDays: { type: "integer", minimum: 1 },
          actualReviewDay: { type: "integer" },
        },
        required: ["lastReviewDay", "intervalDays", "actualReviewDay"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          nominalDay: { type: "integer" },
          deviationDays: { type: "integer" },
          early: { type: "boolean" },
        },
        required: ["nominalDay", "deviationDays", "early"],
      },
      ports: {
        inputs: [
          {
            id: "lastReviewDay",
            label: "Last Review Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "intervalDays",
            label: "Interval Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "actualReviewDay",
            label: "Actual Review Day",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "nominalDay",
            label: "Nominal Day",
            valueType: { type: "integer" },
          },
          {
            id: "deviationDays",
            label: "Deviation Days",
            valueType: { type: "integer" },
          },
          { id: "early", label: "Early", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = biosafetyDocumentReviewAnniversaryOffsetTool.execute;
export default biosafetyDocumentReviewAnniversaryOffsetTool;
