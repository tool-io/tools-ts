import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseline: readonly number[];
  readonly followup: readonly number[];
};
export type Output = {
  readonly baselineSum: number;
  readonly followupSum: number;
  readonly sumChange: number;
  readonly relativeChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseline: { type: "array", maxItems: 256, items: { type: "number" } },
    followup: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["baseline", "followup"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baselineSum: { type: "number" },
    followupSum: { type: "number" },
    sumChange: { type: "number" },
    relativeChange: { type: "number" },
  },
  required: ["baselineSum", "followupSum", "sumChange", "relativeChange"],
} as const;
/** Matched research measurement sums only; target selection, missing lesions and formal response rules are not inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseline, followup } = request;
  const compute = (): Output => {
    H.sameLength(baseline, followup);
    H.domain(
      baseline.length > 0 &&
        [...baseline, ...followup].every((x) => x >= 0) &&
        baseline.reduce((a, b) => a + b, 0) > 0,
    );
    return {
      baselineSum: baseline.reduce((a, b) => a + b, 0),
      followupSum: followup.reduce((a, b) => a + b, 0),
      sumChange:
        followup.reduce((a, b) => a + b, 0) -
        baseline.reduce((a, b) => a + b, 0),
      relativeChange:
        followup.reduce((a, b) => a + b, 0) /
          baseline.reduce((a, b) => a + b, 0) -
        1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseline: [20, 30], followup: [15, 25] },
  output: {
    baselineSum: 50,
    followupSum: 40,
    sumChange: -10,
    relativeChange: -0.19999999999999996,
  },
} satisfies ToolExample<Input, Output>;
export const oncologyStudyMeasurementSumDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oncology/oncology-study-measurement-sum-delta",
    title: "Oncology Study Measurement Sum Delta Tool",
    description:
      "Matched research measurement sums only; target selection, missing lesions and formal response rules are not inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseline: { type: "array", maxItems: 256, items: { type: "number" } },
        followup: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["baseline", "followup"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baselineSum: { type: "number" },
        followupSum: { type: "number" },
        sumChange: { type: "number" },
        relativeChange: { type: "number" },
      },
      required: ["baselineSum", "followupSum", "sumChange", "relativeChange"],
    },
    ports: {
      inputs: [
        {
          id: "baseline",
          label: "Baseline",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "followup",
          label: "Followup",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "baselineSum",
          label: "Baseline Sum",
          valueType: { type: "number" },
        },
        {
          id: "followupSum",
          label: "Followup Sum",
          valueType: { type: "number" },
        },
        { id: "sumChange", label: "Sum Change", valueType: { type: "number" } },
        {
          id: "relativeChange",
          label: "Relative Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = oncologyStudyMeasurementSumDeltaTool.execute;
export default oncologyStudyMeasurementSumDeltaTool;
