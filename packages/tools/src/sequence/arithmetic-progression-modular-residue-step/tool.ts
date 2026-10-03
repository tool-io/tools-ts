import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly residue: number;
  readonly difference: number;
  readonly modulus: number;
};
export type Output = { readonly nextResidue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residue: { type: "integer", minimum: 0 },
    difference: { type: "integer" },
    modulus: { type: "integer", minimum: 1 },
  },
  required: ["residue", "difference", "modulus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { nextResidue: { type: "integer" } },
  required: ["nextResidue"],
} as const;
/** Calculate arithmetic progression modular residue step from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { residue, difference, modulus } = request;
  const compute = (): Output => {
    H.integer(modulus, 1);
    H.integer(residue, 0, modulus - 1);
    return {
      nextResidue: H.mod(residue + H.mod(difference, modulus), modulus),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { residue: 8, difference: 5, modulus: 10 },
  output: { nextResidue: 3 },
} satisfies ToolExample<Input, Output>;
export const arithmeticProgressionModularResidueStepTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "sequence/arithmetic-progression-modular-residue-step",
      title: "Arithmetic Progression Modular Residue Step Tool",
      description:
        "Calculate arithmetic progression modular residue step from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          residue: { type: "integer", minimum: 0 },
          difference: { type: "integer" },
          modulus: { type: "integer", minimum: 1 },
        },
        required: ["residue", "difference", "modulus"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { nextResidue: { type: "integer" } },
        required: ["nextResidue"],
      },
      ports: {
        inputs: [
          {
            id: "residue",
            label: "Residue",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "difference",
            label: "Difference",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "modulus",
            label: "Modulus",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "nextResidue",
            label: "Next Residue",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = arithmeticProgressionModularResidueStepTool.execute;
export default arithmeticProgressionModularResidueStepTool;
