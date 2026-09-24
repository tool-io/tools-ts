import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly resistance: number; readonly reactance: number };
export type Output = {
  readonly conductance: number;
  readonly susceptance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { resistance: { type: "number" }, reactance: { type: "number" } },
  required: ["resistance", "reactance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conductance: { type: "number" },
    susceptance: { type: "number" },
  },
  required: ["conductance", "susceptance"],
} as const;
/** Invert specific acoustic impedance resistance+i*reactance to its complex admittance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resistance, reactance } = request;
  const compute = (): Output => {
    const d = resistance * resistance + reactance * reactance;
    H.positive(d);
    return { conductance: resistance / d, susceptance: -reactance / d };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { resistance: 3, reactance: 4 },
  output: { conductance: 0.12, susceptance: -0.16 },
} satisfies ToolExample<Input, Output>;
export const specificAcousticAdmittanceImpedanceFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/specific-acoustic-admittance-impedance-factor",
      title: "Specific Acoustic Admittance Impedance Factor Tool",
      description:
        "Invert specific acoustic impedance resistance+i*reactance to its complex admittance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          resistance: { type: "number" },
          reactance: { type: "number" },
        },
        required: ["resistance", "reactance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          conductance: { type: "number" },
          susceptance: { type: "number" },
        },
        required: ["conductance", "susceptance"],
      },
      ports: {
        inputs: [
          {
            id: "resistance",
            label: "Resistance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reactance",
            label: "Reactance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "conductance",
            label: "Conductance",
            valueType: { type: "number" },
          },
          {
            id: "susceptance",
            label: "Susceptance",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = specificAcousticAdmittanceImpedanceFactorTool.execute;
export default specificAcousticAdmittanceImpedanceFactorTool;
