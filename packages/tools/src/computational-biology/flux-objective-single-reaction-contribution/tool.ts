import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly objectiveCoefficient: number;
  readonly reactionFlux: number;
};
export type Output = { readonly objectiveContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objectiveCoefficient: { type: "number" },
    reactionFlux: { type: "number" },
  },
  required: ["objectiveCoefficient", "reactionFlux"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { objectiveContribution: { type: "number" } },
  required: ["objectiveContribution"],
} as const;
/** Multiply a supplied reaction flux by its signed linear objective coefficient for one metabolic objective contribution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { objectiveCoefficient, reactionFlux } = request;
  const compute = (): Output => {
    return { objectiveContribution: objectiveCoefficient * reactionFlux };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { objectiveCoefficient: 2, reactionFlux: 3 },
  output: { objectiveContribution: 6 },
} satisfies ToolExample<Input, Output>;
export const fluxObjectiveSingleReactionContributionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["computational-biology", "computational biology", "biology"],
        keywords: ["computational biology", "biology"],
      },
      id: "computational-biology/flux-objective-single-reaction-contribution",
      title: "Flux Objective Single Reaction Contribution",
      description:
        "Multiply a supplied reaction flux by its signed linear objective coefficient for one metabolic objective contribution.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          objectiveCoefficient: { type: "number" },
          reactionFlux: { type: "number" },
        },
        required: ["objectiveCoefficient", "reactionFlux"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { objectiveContribution: { type: "number" } },
        required: ["objectiveContribution"],
      },
      ports: {
        inputs: [
          {
            id: "objectiveCoefficient",
            label: "Objective Coefficient",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reactionFlux",
            label: "Reaction Flux",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "objectiveContribution",
            label: "Objective Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = fluxObjectiveSingleReactionContributionTool.execute;
export default fluxObjectiveSingleReactionContributionTool;
