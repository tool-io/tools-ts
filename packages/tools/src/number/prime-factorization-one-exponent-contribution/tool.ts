import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly prime: number; readonly exponent: number };
export type Output = { readonly factor: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prime: { type: "integer", minimum: 2, maximum: 1000000 },
    exponent: { type: "integer", minimum: 0, maximum: 256 },
  },
  required: ["prime", "exponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { factor: { type: "string", maxLength: 8192 } },
  required: ["factor"],
} as const;
/** Calculate prime factorization one exponent contribution from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { prime, exponent } = input;
  const compute = (): Output => {
    H.integer(prime, 2, 1000000);
    H.integer(exponent, 0, 256);
    for (let i = 2; i * i <= prime; i++) H.domain(prime % i !== 0);
    return { factor: String(BigInt(prime) ** BigInt(exponent)) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { prime: 3, exponent: 4 },
  output: { factor: "81" },
} satisfies ToolExample<Input, Output>;
export const primeFactorizationOneExponentContributionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "number/prime-factorization-one-exponent-contribution",
      title: "Prime Factorization One Exponent Contribution Tool",
      description:
        "Calculate prime factorization one exponent contribution from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          prime: { type: "integer", minimum: 2, maximum: 1000000 },
          exponent: { type: "integer", minimum: 0, maximum: 256 },
        },
        required: ["prime", "exponent"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { factor: { type: "string", maxLength: 8192 } },
        required: ["factor"],
      },
      ports: {
        inputs: [
          {
            id: "prime",
            label: "Prime",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "exponent",
            label: "Exponent",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "factor", label: "Factor", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = primeFactorizationOneExponentContributionTool.execute;
export default primeFactorizationOneExponentContributionTool;
