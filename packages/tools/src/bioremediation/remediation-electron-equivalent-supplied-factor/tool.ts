import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mass: number;
  readonly molarMass: number;
  readonly suppliedElectronsPerMole: number;
};
export type Output = { readonly moles: number; readonly equivalents: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mass: { type: "number", minimum: 0 },
    molarMass: { type: "number", exclusiveMinimum: 0 },
    suppliedElectronsPerMole: { type: "number", minimum: 0 },
  },
  required: ["mass", "molarMass", "suppliedElectronsPerMole"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { moles: { type: "number" }, equivalents: { type: "number" } },
  required: ["moles", "equivalents"],
} as const;
/** Formal equivalent inventory from an explicitly supplied stoichiometric factor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mass, molarMass, suppliedElectronsPerMole } = request;
  const compute = (): Output => {
    H.domain(mass >= 0 && suppliedElectronsPerMole >= 0);
    H.positive(molarMass);
    return {
      moles: mass / molarMass,
      equivalents: (mass * suppliedElectronsPerMole) / molarMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mass: 20, molarMass: 100, suppliedElectronsPerMole: 4 },
  output: { moles: 0.2, equivalents: 0.8 },
} satisfies ToolExample<Input, Output>;
export const remediationElectronEquivalentSuppliedFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bioremediation/remediation-electron-equivalent-supplied-factor",
      title: "Remediation Electron Equivalent Supplied Factor Tool",
      description:
        "Formal equivalent inventory from an explicitly supplied stoichiometric factor.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mass: { type: "number", minimum: 0 },
          molarMass: { type: "number", exclusiveMinimum: 0 },
          suppliedElectronsPerMole: { type: "number", minimum: 0 },
        },
        required: ["mass", "molarMass", "suppliedElectronsPerMole"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          moles: { type: "number" },
          equivalents: { type: "number" },
        },
        required: ["moles", "equivalents"],
      },
      ports: {
        inputs: [
          {
            id: "mass",
            label: "Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "molarMass",
            label: "Molar Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedElectronsPerMole",
            label: "Supplied Electrons Per Mole",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "moles", label: "Moles", valueType: { type: "number" } },
          {
            id: "equivalents",
            label: "Equivalents",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = remediationElectronEquivalentSuppliedFactorTool.execute;
export default remediationElectronEquivalentSuppliedFactorTool;
