import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordTime: number;
  readonly reviewTime: number;
  readonly suppliedClockOffset: number;
};
export type Output = {
  readonly elapsed: number;
  readonly reviewedBeforeRecord: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordTime: { type: "number" },
    reviewTime: { type: "number" },
    suppliedClockOffset: { type: "number" },
  },
  required: ["recordTime", "reviewTime", "suppliedClockOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number" },
    reviewedBeforeRecord: { type: "boolean" },
  },
  required: ["elapsed", "reviewedBeforeRecord"],
} as const;
/** Compare supplied administrative counseling-record timestamps without evaluating advice or clinical care. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordTime, reviewTime, suppliedClockOffset } = request;
  const compute = (): Output => {
    return {
      elapsed: reviewTime - suppliedClockOffset - recordTime,
      reviewedBeforeRecord: reviewTime - suppliedClockOffset < recordTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordTime: 10, reviewTime: 30, suppliedClockOffset: 5 },
  output: { elapsed: 15, reviewedBeforeRecord: false },
} satisfies ToolExample<Input, Output>;
export const counselingRecordReviewGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-pharmacy/counseling-record-review-gap",
    title: "Counseling Record Review Gap Tool",
    description:
      "Compare supplied administrative counseling-record timestamps without evaluating advice or clinical care.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordTime: { type: "number" },
        reviewTime: { type: "number" },
        suppliedClockOffset: { type: "number" },
      },
      required: ["recordTime", "reviewTime", "suppliedClockOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number" },
        reviewedBeforeRecord: { type: "boolean" },
      },
      required: ["elapsed", "reviewedBeforeRecord"],
    },
    ports: {
      inputs: [
        {
          id: "recordTime",
          label: "Record Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reviewTime",
          label: "Review Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedClockOffset",
          label: "Supplied Clock Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        {
          id: "reviewedBeforeRecord",
          label: "Reviewed Before Record",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = counselingRecordReviewGapTool.execute;
export default counselingRecordReviewGapTool;
