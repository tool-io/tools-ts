import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly multipole: number;
  readonly angularPower: number;
};
export type Output = { readonly weightedBandpower: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    multipole: { type: "integer", minimum: 0 },
    angularPower: { type: "number" },
  },
  required: ["multipole", "angularPower"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weightedBandpower: { type: "number" } },
  required: ["weightedBandpower"],
} as const;
/** Calculate D_l=l(l+1)C_l/(2 pi) from an explicit multipole and supplied C_l without beam, mask or noise correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { multipole, angularPower } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(multipole) &&
        multipole >= 0 &&
        multipole <= Number.MAX_SAFE_INTEGER,
      "multipole",
    ),
      multipole);
    return {
      weightedBandpower:
        ((multipole * (multipole + 1)) / (2 * Math.PI)) * angularPower,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { multipole: 2, angularPower: 3 },
  output: { weightedBandpower: 2.864788975654116 },
} satisfies ToolExample<Input, Output>;
export const cmbBandpowerEllWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cosmology", "physics"],
      keywords: ["cosmology", "physics"],
    },
    id: "cosmology/cmb-bandpower-ell-weight",
    title: "CMB Bandpower Ell Weight",
    description:
      "Calculate D_l=l(l+1)C_l/(2 pi) from an explicit multipole and supplied C_l without beam, mask or noise correction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        multipole: { type: "integer", minimum: 0 },
        angularPower: { type: "number" },
      },
      required: ["multipole", "angularPower"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { weightedBandpower: { type: "number" } },
      required: ["weightedBandpower"],
    },
    ports: {
      inputs: [
        {
          id: "multipole",
          label: "Multipole",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "angularPower",
          label: "Angular Power",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedBandpower",
          label: "Weighted Bandpower",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cmbBandpowerEllWeightTool.execute;
export default cmbBandpowerEllWeightTool;
