import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly probabilities: readonly number[];
  readonly first: number;
  readonly last: number;
};
export type Output = { readonly intervalMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probabilities: { type: "array", maxItems: 256, items: { type: "number" } },
    first: { type: "integer", minimum: 0 },
    last: { type: "integer" },
  },
  required: ["probabilities", "first", "last"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { intervalMass: { type: "number" } },
  required: ["intervalMass"],
} as const;
/** Inclusive interval of supplied ordered class indices, with a declared 1e-12 normalization tolerance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { probabilities, first, last } = request;
  const compute = (): Output => {
    H.domain(
      probabilities.length > 0 &&
        probabilities.every((x) => x >= 0 && x <= 1) &&
        Math.abs(probabilities.reduce((s, x) => s + x, 0) - 1) <= 1e-12,
    );
    H.integer(first, 0, probabilities.length - 1);
    H.integer(last, first, probabilities.length - 1);
    return {
      intervalMass: probabilities
        .slice(first, last + 1)
        .reduce((s, x) => s + x, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { probabilities: [0.2, 0.3, 0.5], first: 1, last: 2 },
  output: { intervalMass: 0.8 },
} satisfies ToolExample<Input, Output>;
export const ordinalProbabilityMassIntervalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "classification/ordinal-probability-mass-interval",
    title: "Ordinal Probability Mass Interval Tool",
    description:
      "Inclusive interval of supplied ordered class indices, with a declared 1e-12 normalization tolerance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        probabilities: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        first: { type: "integer", minimum: 0 },
        last: { type: "integer" },
      },
      required: ["probabilities", "first", "last"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { intervalMass: { type: "number" } },
      required: ["intervalMass"],
    },
    ports: {
      inputs: [
        {
          id: "probabilities",
          label: "Probabilities",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "last",
          label: "Last",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "intervalMass",
          label: "Interval Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ordinalProbabilityMassIntervalTool.execute;
export default ordinalProbabilityMassIntervalTool;
