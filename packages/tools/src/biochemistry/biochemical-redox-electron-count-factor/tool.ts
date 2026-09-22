import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly electrons: number;
  readonly faraday: number;
  readonly potentialDifference: number;
};
export type Output = {
  readonly molarFreeEnergy: number;
  readonly chargePerMole: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    electrons: { type: "integer", minimum: 1 },
    faraday: { type: "number", exclusiveMinimum: 0 },
    potentialDifference: { type: "number" },
  },
  required: ["electrons", "faraday", "potentialDifference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    molarFreeEnergy: { type: "number" },
    chargePerMole: { type: "number" },
  },
  required: ["molarFreeEnergy", "chargePerMole"],
} as const;
/** Delta G = -nF*Delta E with explicit Faraday constant and volts; no redox couple or electrochemical reference is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { electrons, faraday, potentialDifference } = request;
  const compute = (): Output => {
    H.integer(electrons, 1);
    H.positive(faraday);
    return {
      molarFreeEnergy: -electrons * faraday * potentialDifference,
      chargePerMole: electrons * faraday,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { electrons: 2, faraday: 100000, potentialDifference: 0.2 },
  output: { molarFreeEnergy: -40000, chargePerMole: 200000 },
} satisfies ToolExample<Input, Output>;
export const biochemicalRedoxElectronCountFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biochemistry/biochemical-redox-electron-count-factor",
      title: "Biochemical Redox Electron Count Factor Tool",
      description:
        "Delta G = -nF*Delta E with explicit Faraday constant and volts; no redox couple or electrochemical reference is inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          electrons: { type: "integer", minimum: 1 },
          faraday: { type: "number", exclusiveMinimum: 0 },
          potentialDifference: { type: "number" },
        },
        required: ["electrons", "faraday", "potentialDifference"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          molarFreeEnergy: { type: "number" },
          chargePerMole: { type: "number" },
        },
        required: ["molarFreeEnergy", "chargePerMole"],
      },
      ports: {
        inputs: [
          {
            id: "electrons",
            label: "Electrons",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "faraday",
            label: "Faraday",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "potentialDifference",
            label: "Potential Difference",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "molarFreeEnergy",
            label: "Molar Free Energy",
            valueType: { type: "number" },
          },
          {
            id: "chargePerMole",
            label: "Charge Per Mole",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biochemicalRedoxElectronCountFactorTool.execute;
export default biochemicalRedoxElectronCountFactorTool;
