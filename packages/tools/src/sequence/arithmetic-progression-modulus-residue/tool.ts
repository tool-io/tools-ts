import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
  decimal,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly first: string;
  readonly step: string;
  readonly index: number;
  readonly modulus: string;
};
export type Output = { readonly residue: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "string", maxLength: 8192 },
    step: { type: "string", maxLength: 8192 },
    index: { type: "integer", minimum: 0 },
    modulus: { type: "string", maxLength: 8192 },
  },
  required: ["first", "step", "index", "modulus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residue: { type: "string", maxLength: 8192 } },
  required: ["residue"],
} as const;
/** Compute arithmetic progression modulus residue from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { first, step, index, modulus } = input;
  const compute = (): Output => {
    const a = decimal(first),
      d = decimal(step),
      n = decimal(modulus);
    domain(n > 0n);
    integer(index);
    const x = a + BigInt(index) * d;
    return { residue: (((x % n) + n) % n).toString() };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { first: "3", step: "4", index: 5, modulus: "7" },
  output: { residue: "2" },
} satisfies ToolExample<Input, Output>;
export const arithmeticProgressionModulusResidueTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "sequence/arithmetic-progression-modulus-residue",
  title: "Arithmetic Progression Modulus Residue Tool",
  description:
    "Compute arithmetic progression modulus residue from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "first",
        label: "First",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "step",
        label: "Step",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "index",
        label: "Index",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "modulus",
        label: "Modulus",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "residue", label: "Residue", valueType: { type: "string" } },
    ],
  },
});
export const run = arithmeticProgressionModulusResidueTool.execute;
export default arithmeticProgressionModulusResidueTool;
