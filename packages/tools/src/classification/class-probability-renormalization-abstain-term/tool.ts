import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
  positive,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly masses: readonly number[];
  readonly abstainIndex: number;
};
export type Output = {
  readonly removed: number;
  readonly factor: number;
  readonly retained: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    masses: { type: "array", maxItems: 256, items: { type: "number" } },
    abstainIndex: { type: "integer", minimum: 0 },
  },
  required: ["masses", "abstainIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    removed: { type: "number" },
    factor: { type: "number" },
    retained: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["removed", "factor", "retained"],
} as const;
/** Compute class probability renormalization abstain term from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { masses, abstainIndex } = input;
  const compute = (): Output => {
    integer(abstainIndex, 0, masses.length - 1);
    domain(masses.every((x) => x >= 0));
    const total = masses.reduce((a, b) => a + b, 0);
    domain(Math.abs(total - 1) <= 1e-12);
    const removed = masses[abstainIndex],
      denominator = 1 - removed;
    positive(denominator);
    return {
      removed,
      factor: 1 / denominator,
      retained: masses
        .filter((_, i) => i !== abstainIndex)
        .map((x) => x / denominator),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { masses: [0.25, 0.25, 0.5], abstainIndex: 2 },
  output: { removed: 0.5, factor: 2, retained: [0.5, 0.5] },
} satisfies ToolExample<Input, Output>;
export const classProbabilityRenormalizationAbstainTermTool =
  defineSchemaCalculation<Input, Output>({
    id: "classification/class-probability-renormalization-abstain-term",
    title: "Class Probability Renormalization Abstain Term Tool",
    description:
      "Compute class probability renormalization abstain term from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "masses",
          label: "Masses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "abstainIndex",
          label: "Abstain Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "removed", label: "Removed", valueType: { type: "number" } },
        { id: "factor", label: "Factor", valueType: { type: "number" } },
        {
          id: "retained",
          label: "Retained",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  });
export const run = classProbabilityRenormalizationAbstainTermTool.execute;
export default classProbabilityRenormalizationAbstainTermTool;
