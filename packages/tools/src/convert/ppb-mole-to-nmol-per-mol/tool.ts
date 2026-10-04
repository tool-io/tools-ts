import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly moleFractionPpb: number };
export type Output = { readonly nanomolesPerMole: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { moleFractionPpb: { type: "number", minimum: 0 } },
  required: ["moleFractionPpb"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { nanomolesPerMole: { type: "number" } },
  required: ["nanomolesPerMole"],
} as const;
/** Express a mole fraction supplied in parts per billion as nmol/mol. This identity is for amount-of-substance fraction, not mass concentration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { moleFractionPpb } = request;
  const compute = (): Output => {
    H.domain(moleFractionPpb >= 0 && moleFractionPpb <= 1e9, "moleFractionPpb");
    return { nanomolesPerMole: moleFractionPpb };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { moleFractionPpb: 12.5 },
  output: { nanomolesPerMole: 12.5 },
} satisfies ToolExample<Input, Output>;
export const ppbMoleToNmolPerMolTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "convert/ppb-mole-to-nmol-per-mol",
      title: "ppb Mole To Nmol Per Mol Tool",
      description:
        "Express a mole fraction supplied in parts per billion as nmol/mol. This identity is for amount-of-substance fraction, not mass concentration.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { moleFractionPpb: { type: "number", minimum: 0 } },
        required: ["moleFractionPpb"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { nanomolesPerMole: { type: "number" } },
        required: ["nanomolesPerMole"],
      },
      ports: {
        inputs: [
          {
            id: "moleFractionPpb",
            label: "Mole Fraction Ppb",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "nanomolesPerMole",
            label: "Nanomoles Per Mole",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = ppbMoleToNmolPerMolTool.execute;
export default ppbMoleToNmolPerMolTool;
