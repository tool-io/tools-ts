import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstEnd: number;
  readonly secondStart: number;
  readonly recordedWashout: number;
  readonly requiredWashout: number;
};
export type Output = {
  readonly actualGap: number;
  readonly discrepancy: number;
  readonly meetsSuppliedGap: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstEnd: { type: "integer" },
    secondStart: { type: "integer" },
    recordedWashout: { type: "integer", minimum: 0 },
    requiredWashout: { type: "integer", minimum: 0 },
  },
  required: ["firstEnd", "secondStart", "recordedWashout", "requiredWashout"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualGap: { type: "integer" },
    discrepancy: { type: "integer" },
    meetsSuppliedGap: { type: "boolean" },
  },
  required: ["actualGap", "discrepancy", "meetsSuppliedGap"],
} as const;
/** Audit supplied crossover chronology against a caller-established washout duration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstEnd, secondStart, recordedWashout, requiredWashout } = request;
  const compute = (): Output => {
    H.integer(recordedWashout, 0);
    H.integer(requiredWashout, 0);
    H.domain(secondStart >= firstEnd);
    return {
      actualGap: secondStart - firstEnd,
      discrepancy: recordedWashout - secondStart + firstEnd,
      meetsSuppliedGap: secondStart - firstEnd >= requiredWashout,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstEnd: 100,
    secondStart: 115,
    recordedWashout: 14,
    requiredWashout: 10,
  },
  output: { actualGap: 15, discrepancy: -1, meetsSuppliedGap: true },
} satisfies ToolExample<Input, Output>;
export const chiropracticStudyCrossoverWashoutRecordTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "chiropractic/chiropractic-study-crossover-washout-record",
      title: "Chiropractic Study Crossover Washout Record Tool",
      description:
        "Audit supplied crossover chronology against a caller-established washout duration.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstEnd: { type: "integer" },
          secondStart: { type: "integer" },
          recordedWashout: { type: "integer", minimum: 0 },
          requiredWashout: { type: "integer", minimum: 0 },
        },
        required: [
          "firstEnd",
          "secondStart",
          "recordedWashout",
          "requiredWashout",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          actualGap: { type: "integer" },
          discrepancy: { type: "integer" },
          meetsSuppliedGap: { type: "boolean" },
        },
        required: ["actualGap", "discrepancy", "meetsSuppliedGap"],
      },
      ports: {
        inputs: [
          {
            id: "firstEnd",
            label: "First End",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "secondStart",
            label: "Second Start",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "recordedWashout",
            label: "Recorded Washout",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "requiredWashout",
            label: "Required Washout",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "actualGap",
            label: "Actual Gap",
            valueType: { type: "integer" },
          },
          {
            id: "discrepancy",
            label: "Discrepancy",
            valueType: { type: "integer" },
          },
          {
            id: "meetsSuppliedGap",
            label: "Meets Supplied Gap",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = chiropracticStudyCrossoverWashoutRecordTool.execute;
export default chiropracticStudyCrossoverWashoutRecordTool;
