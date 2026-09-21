import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly ascendingCoefficients: readonly number[] };
export type Output = {
  readonly multiplicity: number;
  readonly identicallyZero: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ascendingCoefficients: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["ascendingCoefficients"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    multiplicity: { type: "integer" },
    identicallyZero: { type: "boolean" },
  },
  required: ["multiplicity", "identicallyZero"],
} as const;
/** Compute polynomial root zero multiplicity from prefix from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { ascendingCoefficients } = input;
  const compute = (): Output => {
    domain(ascendingCoefficients.length > 0);
    const i = ascendingCoefficients.findIndex((x) => x !== 0);
    return { multiplicity: i < 0 ? 0 : i, identicallyZero: i < 0 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { ascendingCoefficients: [0, 0, 3, 2] },
  output: { multiplicity: 2, identicallyZero: false },
} satisfies ToolExample<Input, Output>;
export const polynomialRootZeroMultiplicityFromPrefixTool =
  defineSchemaCalculation<Input, Output>({
    id: "algebra/polynomial-root-zero-multiplicity-from-prefix",
    title: "Polynomial Root Zero Multiplicity From Prefix Tool",
    description:
      "Compute polynomial root zero multiplicity from prefix from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "ascendingCoefficients",
          label: "Ascending Coefficients",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "multiplicity",
          label: "Multiplicity",
          valueType: { type: "integer" },
        },
        {
          id: "identicallyZero",
          label: "Identically Zero",
          valueType: { type: "boolean" },
        },
      ],
    },
  });
export const run = polynomialRootZeroMultiplicityFromPrefixTool.execute;
export default polynomialRootZeroMultiplicityFromPrefixTool;
