import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly peakStrain: number;
  readonly recoveredStrain: number;
};
export type Output = { readonly residualStrain: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    peakStrain: { type: "number", minimum: 0 },
    recoveredStrain: { type: "number", minimum: 0 },
  },
  required: ["peakStrain", "recoveredStrain"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residualStrain: { type: "number" } },
  required: ["residualStrain"],
} as const;
/** Subtract explicitly recovered strain from peak creep strain using one strain convention without estimating a material model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { peakStrain, recoveredStrain } = request;
  const compute = (): Output => {
    H.domain(peakStrain >= 0, "peakStrain");
    H.domain(recoveredStrain >= 0, "recoveredStrain");
    return { residualStrain: peakStrain - recoveredStrain };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { peakStrain: 0.2, recoveredStrain: 0.125 },
  output: { residualStrain: 0.07500000000000001 },
} satisfies ToolExample<Input, Output>;
export const biomaterialCreepRecoveryResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioengineering", "engineering"],
      keywords: ["bioengineering", "engineering"],
    },
    id: "bioengineering/biomaterial-creep-recovery-residual",
    title: "Biomaterial Creep Recovery Residual",
    description:
      "Subtract explicitly recovered strain from peak creep strain using one strain convention without estimating a material model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        peakStrain: { type: "number", minimum: 0 },
        recoveredStrain: { type: "number", minimum: 0 },
      },
      required: ["peakStrain", "recoveredStrain"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { residualStrain: { type: "number" } },
      required: ["residualStrain"],
    },
    ports: {
      inputs: [
        {
          id: "peakStrain",
          label: "Peak Strain",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recoveredStrain",
          label: "Recovered Strain",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "residualStrain",
          label: "Residual Strain",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = biomaterialCreepRecoveryResidualTool.execute;
export default biomaterialCreepRecoveryResidualTool;
