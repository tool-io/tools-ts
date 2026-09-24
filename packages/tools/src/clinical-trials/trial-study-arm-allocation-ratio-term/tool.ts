import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly weights: readonly number[];
  readonly totalSubjects: number;
};
export type Output = {
  readonly idealCounts: readonly number[];
  readonly floorCounts: readonly number[];
  readonly unallocated: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weights: { type: "array", maxItems: 256, items: { type: "integer" } },
    totalSubjects: { type: "integer", minimum: 0 },
  },
  required: ["weights", "totalSubjects"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    idealCounts: { type: "array", maxItems: 256, items: { type: "number" } },
    floorCounts: { type: "array", maxItems: 256, items: { type: "integer" } },
    unallocated: { type: "integer" },
  },
  required: ["idealCounts", "floorCounts", "unallocated"],
} as const;
/** Ratio allocation arithmetic with explicit unallocated remainder, without randomization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weights, totalSubjects } = request;
  const compute = (): Output => {
    H.integer(totalSubjects, 0);
    H.domain(weights.length > 0 && weights.every((x) => x > 0));
    return {
      idealCounts: weights.map(
        (x) => (x * totalSubjects) / weights.reduce((a, b) => a + b, 0),
      ),
      floorCounts: weights.map((x) =>
        Math.floor((x * totalSubjects) / weights.reduce((a, b) => a + b, 0)),
      ),
      unallocated:
        totalSubjects -
        weights.reduce(
          (a, x) =>
            a +
            Math.floor(
              (x * totalSubjects) / weights.reduce((b, c) => b + c, 0),
            ),
          0,
        ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { weights: [2, 1], totalSubjects: 10 },
  output: {
    idealCounts: [6.666666666666667, 3.3333333333333335],
    floorCounts: [6, 3],
    unallocated: 1,
  },
} satisfies ToolExample<Input, Output>;
export const trialStudyArmAllocationRatioTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-trials/trial-study-arm-allocation-ratio-term",
    title: "Trial Study Arm Allocation Ratio Term Tool",
    description:
      "Ratio allocation arithmetic with explicit unallocated remainder, without randomization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weights: { type: "array", maxItems: 256, items: { type: "integer" } },
        totalSubjects: { type: "integer", minimum: 0 },
      },
      required: ["weights", "totalSubjects"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        idealCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        floorCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        unallocated: { type: "integer" },
      },
      required: ["idealCounts", "floorCounts", "unallocated"],
    },
    ports: {
      inputs: [
        {
          id: "weights",
          label: "Weights",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "totalSubjects",
          label: "Total Subjects",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "idealCounts",
          label: "Ideal Counts",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "floorCounts",
          label: "Floor Counts",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "unallocated",
          label: "Unallocated",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = trialStudyArmAllocationRatioTermTool.execute;
export default trialStudyArmAllocationRatioTermTool;
