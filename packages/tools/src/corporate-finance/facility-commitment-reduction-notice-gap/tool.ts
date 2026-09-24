import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly noticeDay: number;
  readonly reductionDay: number;
  readonly requiredDays: number;
};
export type Output = {
  readonly noticeDays: number;
  readonly margin: number;
  readonly meetsSuppliedNotice: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    noticeDay: { type: "integer" },
    reductionDay: { type: "integer" },
    requiredDays: { type: "integer", minimum: 0 },
  },
  required: ["noticeDay", "reductionDay", "requiredDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    noticeDays: { type: "integer" },
    margin: { type: "integer" },
    meetsSuppliedNotice: { type: "boolean" },
  },
  required: ["noticeDays", "margin", "meetsSuppliedNotice"],
} as const;
/** Calculate facility commitment reduction notice gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { noticeDay, reductionDay, requiredDays } = request;
  const compute = (): Output => {
    H.integer(requiredDays, 0);
    return {
      noticeDays: reductionDay - noticeDay,
      margin: reductionDay - noticeDay - requiredDays,
      meetsSuppliedNotice: reductionDay - noticeDay >= requiredDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { noticeDay: 100, reductionDay: 130, requiredDays: 20 },
  output: { noticeDays: 30, margin: 10, meetsSuppliedNotice: true },
} satisfies ToolExample<Input, Output>;
export const facilityCommitmentReductionNoticeGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "corporate-finance/facility-commitment-reduction-notice-gap",
      title: "Facility Commitment Reduction Notice Gap Tool",
      description:
        "Calculate facility commitment reduction notice gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          noticeDay: { type: "integer" },
          reductionDay: { type: "integer" },
          requiredDays: { type: "integer", minimum: 0 },
        },
        required: ["noticeDay", "reductionDay", "requiredDays"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          noticeDays: { type: "integer" },
          margin: { type: "integer" },
          meetsSuppliedNotice: { type: "boolean" },
        },
        required: ["noticeDays", "margin", "meetsSuppliedNotice"],
      },
      ports: {
        inputs: [
          {
            id: "noticeDay",
            label: "Notice Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "reductionDay",
            label: "Reduction Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "requiredDays",
            label: "Required Days",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "noticeDays",
            label: "Notice Days",
            valueType: { type: "integer" },
          },
          { id: "margin", label: "Margin", valueType: { type: "integer" } },
          {
            id: "meetsSuppliedNotice",
            label: "Meets Supplied Notice",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = facilityCommitmentReductionNoticeGapTool.execute;
export default facilityCommitmentReductionNoticeGapTool;
