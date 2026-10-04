import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly walkBudget: number;
  readonly networkDetourFactor: number;
};
export type Output = {
  readonly equivalentRadius: number;
  readonly circleArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    walkBudget: { type: "number", minimum: 0 },
    networkDetourFactor: { type: "number", minimum: 1 },
  },
  required: ["walkBudget", "networkDetourFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equivalentRadius: { type: "number" },
    circleArea: { type: "number" },
  },
  required: ["equivalentRadius", "circleArea"],
} as const;
/** Ideal circular approximation from an explicit detour factor, excluding actual network topology and barriers. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { walkBudget, networkDetourFactor } = request;
  const compute = (): Output => {
    H.domain(walkBudget >= 0 && networkDetourFactor >= 1);
    return {
      equivalentRadius: walkBudget / networkDetourFactor,
      circleArea: Math.PI * (walkBudget / networkDetourFactor) ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { walkBudget: 600, networkDetourFactor: 1.5 },
  output: { equivalentRadius: 400, circleArea: 502654.8245743669 },
} satisfies ToolExample<Input, Output>;
export const transitStopWalkshedStraightLineFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "urban-planning/transit-stop-walkshed-straight-line-factor",
      title: "Transit Stop Walkshed Straight Line Factor Tool",
      description:
        "Ideal circular approximation from an explicit detour factor, excluding actual network topology and barriers.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          walkBudget: { type: "number", minimum: 0 },
          networkDetourFactor: { type: "number", minimum: 1 },
        },
        required: ["walkBudget", "networkDetourFactor"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          equivalentRadius: { type: "number" },
          circleArea: { type: "number" },
        },
        required: ["equivalentRadius", "circleArea"],
      },
      ports: {
        inputs: [
          {
            id: "walkBudget",
            label: "Walk Budget",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "networkDetourFactor",
            label: "Network Detour Factor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "equivalentRadius",
            label: "Equivalent Radius",
            valueType: { type: "number" },
          },
          {
            id: "circleArea",
            label: "Circle Area",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = transitStopWalkshedStraightLineFactorTool.execute;
export default transitStopWalkshedStraightLineFactorTool;
