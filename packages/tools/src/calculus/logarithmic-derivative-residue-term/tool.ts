import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly multiplicity: number;
  readonly poleOrder: number;
};
export type Output = { readonly residue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    multiplicity: { type: "integer", minimum: 0 },
    poleOrder: { type: "integer", minimum: 0 },
  },
  required: ["multiplicity", "poleOrder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residue: { type: "integer" } },
  required: ["residue"],
} as const;
/** Calculate logarithmic derivative residue term from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { multiplicity, poleOrder } = input;
  const compute = (): Output => {
    H.integer(multiplicity, 0);
    H.integer(poleOrder, 0);
    return { residue: multiplicity - poleOrder };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { multiplicity: 3, poleOrder: 1 },
  output: { residue: 2 },
} satisfies ToolExample<Input, Output>;
export const logarithmicDerivativeResidueTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/logarithmic-derivative-residue-term",
    title: "Logarithmic Derivative Residue Term Tool",
    description:
      "Calculate logarithmic derivative residue term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        multiplicity: { type: "integer", minimum: 0 },
        poleOrder: { type: "integer", minimum: 0 },
      },
      required: ["multiplicity", "poleOrder"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { residue: { type: "integer" } },
      required: ["residue"],
    },
    ports: {
      inputs: [
        {
          id: "multiplicity",
          label: "Multiplicity",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "poleOrder",
          label: "Pole Order",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "residue", label: "Residue", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = logarithmicDerivativeResidueTermTool.execute;
export default logarithmicDerivativeResidueTermTool;
