import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly moles: number;
  readonly temperature: number;
  readonly gasConstant: number;
  readonly initialVolume: number;
  readonly finalVolume: number;
};
export type Output = { readonly workByGas: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    moles: { type: "number", minimum: 0 },
    temperature: { type: "number", exclusiveMinimum: 0 },
    gasConstant: { type: "number", exclusiveMinimum: 0 },
    initialVolume: { type: "number", exclusiveMinimum: 0 },
    finalVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "moles",
    "temperature",
    "gasConstant",
    "initialVolume",
    "finalVolume",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { workByGas: { type: "number" } },
  required: ["workByGas"],
} as const;
/** Calculate ideal gas isothermal work ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { moles, temperature, gasConstant, initialVolume, finalVolume } =
    request;
  const compute = (): Output => {
    H.domain(moles >= 0);
    H.positive(temperature);
    H.positive(gasConstant);
    H.positive(initialVolume);
    H.positive(finalVolume);
    return {
      workByGas:
        moles *
        gasConstant *
        temperature *
        Math.log(finalVolume / initialVolume),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    moles: 1,
    temperature: 300,
    gasConstant: 8.314462618,
    initialVolume: 1,
    finalVolume: 2,
  },
  output: { workByGas: 1728.9438964613287 },
} satisfies ToolExample<Input, Output>;
export const idealGasIsothermalWorkRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/ideal-gas-isothermal-work-ratio",
    title: "Ideal Gas Isothermal Work Ratio Tool",
    description:
      "Calculate ideal gas isothermal work ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        moles: { type: "number", minimum: 0 },
        temperature: { type: "number", exclusiveMinimum: 0 },
        gasConstant: { type: "number", exclusiveMinimum: 0 },
        initialVolume: { type: "number", exclusiveMinimum: 0 },
        finalVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "moles",
        "temperature",
        "gasConstant",
        "initialVolume",
        "finalVolume",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { workByGas: { type: "number" } },
      required: ["workByGas"],
    },
    ports: {
      inputs: [
        {
          id: "moles",
          label: "Moles",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "temperature",
          label: "Temperature",
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
          id: "initialVolume",
          label: "Initial Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "finalVolume",
          label: "Final Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "workByGas",
          label: "Work By Gas",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = idealGasIsothermalWorkRatioTool.execute;
export default idealGasIsothermalWorkRatioTool;
