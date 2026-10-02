import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly masses: readonly number[];
  readonly selected: number;
};
export type Output = {
  readonly normalizedProbability: number;
  readonly odds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    masses: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    selected: { type: "integer", minimum: 0 },
  },
  required: ["masses", "selected"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedProbability: { type: "number" },
    odds: { type: "number" },
  },
  required: ["normalizedProbability", "odds"],
} as const;
/** Compute one atom’s normalized probability and odds from supplied nonnegative categorical masses. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { masses, selected } = request;
  const compute = (): Output => {
    H.domain(masses.every((x) => x >= 0));
    H.integer(selected, 0, masses.length - 1);
    const rawAtom = masses[selected],
      rawRest = masses.reduce((s, x, i) => s + (i === selected ? 0 : x), 0);
    if (Number.isFinite(rawRest) && Number.isFinite(rawAtom + rawRest)) {
      H.positive(rawRest);
      return {
        normalizedProbability: rawAtom / (rawAtom + rawRest),
        odds: rawAtom / rawRest,
      };
    }
    const scale = Math.max(...masses);
    H.positive(scale);
    const weights = masses.map((x) => x / scale),
      rest = weights.reduce((s, x, i) => s + (i === selected ? 0 : x), 0);
    H.positive(rest);
    const atom = weights[selected];
    return { normalizedProbability: atom / (atom + rest), odds: atom / rest };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { masses: [2, 3, 5], selected: 1 },
  output: { normalizedProbability: 0.3, odds: 0.42857142857142855 },
} satisfies ToolExample<Input, Output>;
export const categoricalAtomOddsFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "probability/categorical-atom-odds-factor",
    title: "Categorical Atom Odds Factor Tool",
    description:
      "Compute one atom’s normalized probability and odds from supplied nonnegative categorical masses.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        masses: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        selected: { type: "integer", minimum: 0 },
      },
      required: ["masses", "selected"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalizedProbability: { type: "number" },
        odds: { type: "number" },
      },
      required: ["normalizedProbability", "odds"],
    },
    ports: {
      inputs: [
        {
          id: "masses",
          label: "Masses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "selected",
          label: "Selected",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "normalizedProbability",
          label: "Normalized Probability",
          valueType: { type: "number" },
        },
        { id: "odds", label: "Odds", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = categoricalAtomOddsFactorTool.execute;
export default categoricalAtomOddsFactorTool;
