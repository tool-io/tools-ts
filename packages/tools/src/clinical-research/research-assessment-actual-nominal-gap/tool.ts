import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nominalTimes: readonly number[];
  readonly actualTimes: readonly number[];
  readonly tolerance: number;
};
export type Output = {
  readonly deviations: readonly number[];
  readonly outsideIndices: readonly number[];
  readonly maximumDeviation: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalTimes: { type: "array", maxItems: 256, items: { type: "number" } },
    actualTimes: { type: "array", maxItems: 256, items: { type: "number" } },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["nominalTimes", "actualTimes", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deviations: { type: "array", maxItems: 256, items: { type: "number" } },
    outsideIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    maximumDeviation: { type: "number" },
  },
  required: ["deviations", "outsideIndices", "maximumDeviation"],
} as const;
/** Calculate research assessment actual nominal gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nominalTimes, actualTimes, tolerance } = request;
  const compute = (): Output => {
    H.sameLength(nominalTimes, actualTimes);
    H.domain(tolerance >= 0);
    return {
      deviations: actualTimes.map((x, i) => x - nominalTimes[i]),
      outsideIndices: actualTimes.flatMap((x, i) =>
        Math.abs(x - nominalTimes[i]) > tolerance ? [i] : [],
      ),
      maximumDeviation: Math.max(
        0,
        ...actualTimes.map((x, i) => Math.abs(x - nominalTimes[i])),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    nominalTimes: [10, 20, 30],
    actualTimes: [11, 18, 34],
    tolerance: 2,
  },
  output: { deviations: [1, -2, 4], outsideIndices: [2], maximumDeviation: 4 },
} satisfies ToolExample<Input, Output>;
export const researchAssessmentActualNominalGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-research/research-assessment-actual-nominal-gap",
    title: "Research Assessment Actual Nominal Gap Tool",
    description:
      "Calculate research assessment actual nominal gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalTimes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        actualTimes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        tolerance: { type: "number", minimum: 0 },
      },
      required: ["nominalTimes", "actualTimes", "tolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deviations: { type: "array", maxItems: 256, items: { type: "number" } },
        outsideIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        maximumDeviation: { type: "number" },
      },
      required: ["deviations", "outsideIndices", "maximumDeviation"],
    },
    ports: {
      inputs: [
        {
          id: "nominalTimes",
          label: "Nominal Times",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "actualTimes",
          label: "Actual Times",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "tolerance",
          label: "Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "deviations",
          label: "Deviations",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "outsideIndices",
          label: "Outside Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "maximumDeviation",
          label: "Maximum Deviation",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchAssessmentActualNominalGapTool.execute;
export default researchAssessmentActualNominalGapTool;
