import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentCounts: readonly number[];
  readonly targetWeights: readonly number[];
  readonly candidateArm: number;
  readonly totalAfter: number;
};
export type Output = {
  readonly projectedCounts: readonly number[];
  readonly absoluteImbalance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentCounts: { type: "array", maxItems: 256, items: { type: "integer" } },
    targetWeights: { type: "array", maxItems: 256, items: { type: "number" } },
    candidateArm: { type: "integer", minimum: 0 },
    totalAfter: { type: "integer", minimum: 1 },
  },
  required: ["currentCounts", "targetWeights", "candidateArm", "totalAfter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    projectedCounts: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    absoluteImbalance: { type: "number" },
  },
  required: ["projectedCounts", "absoluteImbalance"],
} as const;
/** Score one supplied candidate allocation against explicit arm targets; no assignment or random choice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentCounts, targetWeights, candidateArm, totalAfter } = request;
  const compute = (): Output => {
    H.sameLength(currentCounts, targetWeights);
    H.integer(candidateArm, 0, currentCounts.length - 1);
    H.domain(
      currentCounts.every((x) => x >= 0) && targetWeights.every((x) => x > 0),
    );
    H.integer(totalAfter, 1);
    H.domain(
      currentCounts.reduce((a, b) => a + b, 0) + 1 === totalAfter,
      "totalAfter",
    );
    const projectedCounts = currentCounts.map(
        (x, i) => x + (i === candidateArm ? 1 : 0),
      ),
      sum = targetWeights.reduce((a, b) => a + b, 0);
    return {
      projectedCounts,
      absoluteImbalance: projectedCounts.reduce(
        (a, x, i) => a + Math.abs(x - (totalAfter * targetWeights[i]) / sum),
        0,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    currentCounts: [3, 2],
    targetWeights: [1, 1],
    candidateArm: 1,
    totalAfter: 6,
  },
  output: { projectedCounts: [3, 3], absoluteImbalance: 0 },
} satisfies ToolExample<Input, Output>;
export const trialMinimizationSuppliedArmImbalanceTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "clinical-trials/trial-minimization-supplied-arm-imbalance-term",
      title: "Trial Minimization Supplied Arm Imbalance Term Tool",
      description:
        "Score one supplied candidate allocation against explicit arm targets; no assignment or random choice.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          currentCounts: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
          targetWeights: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          candidateArm: { type: "integer", minimum: 0 },
          totalAfter: { type: "integer", minimum: 1 },
        },
        required: [
          "currentCounts",
          "targetWeights",
          "candidateArm",
          "totalAfter",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          projectedCounts: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
          absoluteImbalance: { type: "number" },
        },
        required: ["projectedCounts", "absoluteImbalance"],
      },
      ports: {
        inputs: [
          {
            id: "currentCounts",
            label: "Current Counts",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "targetWeights",
            label: "Target Weights",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "candidateArm",
            label: "Candidate Arm",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "totalAfter",
            label: "Total After",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "projectedCounts",
            label: "Projected Counts",
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "absoluteImbalance",
            label: "Absolute Imbalance",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = trialMinimizationSuppliedArmImbalanceTermTool.execute;
export default trialMinimizationSuppliedArmImbalanceTermTool;
