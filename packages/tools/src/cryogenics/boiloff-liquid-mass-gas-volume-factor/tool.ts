import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly liquidVolume: number;
  readonly liquidDensity: number;
  readonly gasMolarMass: number;
  readonly gasConstant: number;
  readonly gasTemperatureK: number;
  readonly gasPressure: number;
};
export type Output = {
  readonly mass: number;
  readonly moles: number;
  readonly gasVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    liquidVolume: { type: "number", minimum: 0 },
    liquidDensity: { type: "number", exclusiveMinimum: 0 },
    gasMolarMass: { type: "number", exclusiveMinimum: 0 },
    gasConstant: { type: "number", exclusiveMinimum: 0 },
    gasTemperatureK: { type: "number", exclusiveMinimum: 0 },
    gasPressure: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "liquidVolume",
    "liquidDensity",
    "gasMolarMass",
    "gasConstant",
    "gasTemperatureK",
    "gasPressure",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mass: { type: "number" },
    moles: { type: "number" },
    gasVolume: { type: "number" },
  },
  required: ["mass", "moles", "gasVolume"],
} as const;
/** Mass conservation and ideal-gas expansion at explicit conditions, without a ventilation or pressure-safety determination. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    liquidVolume,
    liquidDensity,
    gasMolarMass,
    gasConstant,
    gasTemperatureK,
    gasPressure,
  } = request;
  const compute = (): Output => {
    H.domain(liquidVolume >= 0);
    H.positive(liquidDensity);
    H.positive(gasMolarMass);
    H.positive(gasConstant);
    H.positive(gasTemperatureK);
    H.positive(gasPressure);
    return {
      mass: liquidVolume * liquidDensity,
      moles: (liquidVolume * liquidDensity) / gasMolarMass,
      gasVolume:
        (liquidVolume * liquidDensity * gasConstant * gasTemperatureK) /
        (gasMolarMass * gasPressure),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    liquidVolume: 0.01,
    liquidDensity: 800,
    gasMolarMass: 0.028,
    gasConstant: 8.31446261815324,
    gasTemperatureK: 300,
    gasPressure: 100000,
  },
  output: { mass: 8, moles: 285.7142857142857, gasVolume: 7.126682244131349 },
} satisfies ToolExample<Input, Output>;
export const boiloffLiquidMassGasVolumeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cryogenics/boiloff-liquid-mass-gas-volume-factor",
    title: "Boiloff Liquid Mass Gas Volume Factor Tool",
    description:
      "Mass conservation and ideal-gas expansion at explicit conditions, without a ventilation or pressure-safety determination.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        liquidVolume: { type: "number", minimum: 0 },
        liquidDensity: { type: "number", exclusiveMinimum: 0 },
        gasMolarMass: { type: "number", exclusiveMinimum: 0 },
        gasConstant: { type: "number", exclusiveMinimum: 0 },
        gasTemperatureK: { type: "number", exclusiveMinimum: 0 },
        gasPressure: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "liquidVolume",
        "liquidDensity",
        "gasMolarMass",
        "gasConstant",
        "gasTemperatureK",
        "gasPressure",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mass: { type: "number" },
        moles: { type: "number" },
        gasVolume: { type: "number" },
      },
      required: ["mass", "moles", "gasVolume"],
    },
    ports: {
      inputs: [
        {
          id: "liquidVolume",
          label: "Liquid Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "liquidDensity",
          label: "Liquid Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gasMolarMass",
          label: "Gas Molar Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gasConstant",
          label: "Gas Constant",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gasTemperatureK",
          label: "Gas Temperature K",
          required: true,
          valueType: { type: "number", unit: "K" },
        },
        {
          id: "gasPressure",
          label: "Gas Pressure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "mass", label: "Mass", valueType: { type: "number" } },
        { id: "moles", label: "Moles", valueType: { type: "number" } },
        { id: "gasVolume", label: "Gas Volume", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = boiloffLiquidMassGasVolumeFactorTool.execute;
export default boiloffLiquidMassGasVolumeFactorTool;
