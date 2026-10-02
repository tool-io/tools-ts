import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousCoverageEnd: number;
  readonly nextRecordStart: number;
  readonly graceDays: number;
};
export type Output = { readonly gap: number; readonly adjustedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousCoverageEnd: { type: "number" },
    nextRecordStart: { type: "number" },
    graceDays: { type: "number", minimum: 0 },
  },
  required: ["previousCoverageEnd", "nextRecordStart", "graceDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" }, adjustedGap: { type: "number" } },
  required: ["gap", "adjustedGap"],
} as const;
/** Audit deidentified record coverage with an explicit grace interval; no adherence or treatment recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousCoverageEnd, nextRecordStart, graceDays } = request;
  const compute = (): Output => {
    H.domain(graceDays >= 0);
    return {
      gap: nextRecordStart - previousCoverageEnd,
      adjustedGap: Math.max(
        0,
        nextRecordStart - previousCoverageEnd - graceDays,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousCoverageEnd: 10, nextRecordStart: 20, graceDays: 3 },
  output: { gap: 10, adjustedGap: 7 },
} satisfies ToolExample<Input, Output>;
export const dispensingGapReferenceDayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacoepidemiology/dispensing-gap-reference-day",
    title: "Dispensing Gap Reference Day Tool",
    description:
      "Audit deidentified record coverage with an explicit grace interval; no adherence or treatment recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousCoverageEnd: { type: "number" },
        nextRecordStart: { type: "number" },
        graceDays: { type: "number", minimum: 0 },
      },
      required: ["previousCoverageEnd", "nextRecordStart", "graceDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" }, adjustedGap: { type: "number" } },
      required: ["gap", "adjustedGap"],
    },
    ports: {
      inputs: [
        {
          id: "previousCoverageEnd",
          label: "Previous Coverage End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextRecordStart",
          label: "Next Record Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "graceDays",
          label: "Grace Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        {
          id: "adjustedGap",
          label: "Adjusted Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dispensingGapReferenceDayTool.execute;
export default dispensingGapReferenceDayTool;
