import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstKd: number;
  readonly secondKd: number;
  readonly temperatureKelvin: number;
  readonly gasConstantJoulesPerMoleKelvin: number;
};
export type Output = {
  readonly firstMinusSecondFreeEnergyJoulesPerMole: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstKd: { type: "number", exclusiveMinimum: 0 },
    secondKd: { type: "number", exclusiveMinimum: 0 },
    temperatureKelvin: { type: "number", exclusiveMinimum: 0 },
    gasConstantJoulesPerMoleKelvin: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "firstKd",
    "secondKd",
    "temperatureKelvin",
    "gasConstantJoulesPerMoleKelvin",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { firstMinusSecondFreeEnergyJoulesPerMole: { type: "number" } },
  required: ["firstMinusSecondFreeEnergyJoulesPerMole"],
} as const;
/** Compare standard binding free energies as RT ln(Kd1/Kd2) using same-unit dissociation constants and an explicit gas constant. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstKd,
    secondKd,
    temperatureKelvin,
    gasConstantJoulesPerMoleKelvin,
  } = request;
  const compute = (): Output => {
    (H.domain(firstKd > 0, "firstKd"), firstKd);
    (H.domain(secondKd > 0, "secondKd"), secondKd);
    (H.domain(temperatureKelvin > 0, "temperatureKelvin"), temperatureKelvin);
    (H.domain(
      gasConstantJoulesPerMoleKelvin > 0,
      "gasConstantJoulesPerMoleKelvin",
    ),
      gasConstantJoulesPerMoleKelvin);
    return {
      firstMinusSecondFreeEnergyJoulesPerMole:
        gasConstantJoulesPerMoleKelvin *
        temperatureKelvin *
        (Math.log(firstKd) - Math.log(secondKd)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstKd: 0.000002,
    secondKd: 0.000001,
    temperatureKelvin: 298.15,
    gasConstantJoulesPerMoleKelvin: 8.31446261815324,
  },
  output: { firstMinusSecondFreeEnergyJoulesPerMole: 1718.2820757981524 },
} satisfies ToolExample<Input, Output>;
export const bindingFreeEnergyKdRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biophysics", "physics"],
      keywords: ["biophysics", "physics"],
    },
    id: "biophysics/binding-free-energy-kd-ratio",
    title: "Binding Free Energy Kd Ratio",
    description:
      "Compare standard binding free energies as RT ln(Kd1/Kd2) using same-unit dissociation constants and an explicit gas constant.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstKd: { type: "number", exclusiveMinimum: 0 },
        secondKd: { type: "number", exclusiveMinimum: 0 },
        temperatureKelvin: { type: "number", exclusiveMinimum: 0 },
        gasConstantJoulesPerMoleKelvin: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "firstKd",
        "secondKd",
        "temperatureKelvin",
        "gasConstantJoulesPerMoleKelvin",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstMinusSecondFreeEnergyJoulesPerMole: { type: "number" },
      },
      required: ["firstMinusSecondFreeEnergyJoulesPerMole"],
    },
    ports: {
      inputs: [
        {
          id: "firstKd",
          label: "First Kd",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondKd",
          label: "Second Kd",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "temperatureKelvin",
          label: "Temperature Kelvin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gasConstantJoulesPerMoleKelvin",
          label: "Gas Constant Joules Per Mole Kelvin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstMinusSecondFreeEnergyJoulesPerMole",
          label: "First Minus Second Free Energy Joules Per Mole",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bindingFreeEnergyKdRatioTool.execute;
export default bindingFreeEnergyKdRatioTool;
