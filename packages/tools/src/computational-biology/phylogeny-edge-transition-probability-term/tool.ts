import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly substitutionRate: number;
  readonly branchDuration: number;
};
export type Output = {
  readonly stayProbability: number;
  readonly oneOtherBaseProbability: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    substitutionRate: { type: "number", minimum: 0 },
    branchDuration: { type: "number", minimum: 0 },
  },
  required: ["substitutionRate", "branchDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stayProbability: { type: "number" },
    oneOtherBaseProbability: { type: "number" },
  },
  required: ["stayProbability", "oneOtherBaseProbability"],
} as const;
/** Jukes-Cantor four-state DNA model where rate is total expected substitutions per site per time; oneOtherBaseProbability is for one specified other base. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { substitutionRate, branchDuration } = request;
  const compute = (): Output => {
    H.domain(substitutionRate >= 0 && branchDuration >= 0);
    return {
      stayProbability:
        0.25 + 0.75 * Math.exp((-4 * substitutionRate * branchDuration) / 3),
      oneOtherBaseProbability:
        (1 - Math.exp((-4 * substitutionRate * branchDuration) / 3)) / 4,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { substitutionRate: 0, branchDuration: 2 },
  output: { stayProbability: 1, oneOtherBaseProbability: 0 },
} satisfies ToolExample<Input, Output>;
export const phylogenyEdgeTransitionProbabilityTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "computational-biology/phylogeny-edge-transition-probability-term",
      title: "Phylogeny Edge Transition Probability Term Tool",
      description:
        "Jukes-Cantor four-state DNA model where rate is total expected substitutions per site per time; oneOtherBaseProbability is for one specified other base.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          substitutionRate: { type: "number", minimum: 0 },
          branchDuration: { type: "number", minimum: 0 },
        },
        required: ["substitutionRate", "branchDuration"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          stayProbability: { type: "number" },
          oneOtherBaseProbability: { type: "number" },
        },
        required: ["stayProbability", "oneOtherBaseProbability"],
      },
      ports: {
        inputs: [
          {
            id: "substitutionRate",
            label: "Substitution Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "branchDuration",
            label: "Branch Duration",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "stayProbability",
            label: "Stay Probability",
            valueType: { type: "number" },
          },
          {
            id: "oneOtherBaseProbability",
            label: "One Other Base Probability",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = phylogenyEdgeTransitionProbabilityTermTool.execute;
export default phylogenyEdgeTransitionProbabilityTermTool;
