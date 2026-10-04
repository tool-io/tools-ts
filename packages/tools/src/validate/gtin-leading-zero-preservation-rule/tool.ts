import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly identifier: string };
export type Output = {
  readonly canonical14: string;
  readonly leadingZeros: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { identifier: { type: "string", maxLength: 8192 } },
  required: ["identifier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    canonical14: { type: "string", maxLength: 8192 },
    leadingZeros: { type: "integer" },
  },
  required: ["canonical14", "leadingZeros"],
} as const;
/** Compute gtin leading zero preservation rule from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { identifier } = input;
  const compute = (): Output => {
    domain(
      [8, 12, 13, 14].includes(identifier.length) &&
        /^\d+(?![\s\S])/.test(identifier),
    );
    return {
      canonical14: identifier.padStart(14, "0"),
      leadingZeros: identifier.match(/^0*/)![0].length,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { identifier: "012345678905" },
  output: { canonical14: "00012345678905", leadingZeros: 1 },
} satisfies ToolExample<Input, Output>;
export const gtinLeadingZeroPreservationRuleTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "validate/gtin-leading-zero-preservation-rule",
  title: "GTIN Leading Zero Preservation Rule Tool",
  description:
    "Compute gtin leading zero preservation rule from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "identifier",
        label: "Identifier",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      {
        id: "canonical14",
        label: "Canonical14",
        valueType: { type: "string" },
      },
      {
        id: "leadingZeros",
        label: "Leading Zeros",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = gtinLeadingZeroPreservationRuleTool.execute;
export default gtinLeadingZeroPreservationRuleTool;
