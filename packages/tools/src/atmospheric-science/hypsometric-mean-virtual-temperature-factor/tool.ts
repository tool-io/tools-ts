import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gasConstant: number;
  readonly virtualTemperature: number;
  readonly gravity: number;
  readonly lowerPressure: number;
  readonly upperPressure: number;
};
export type Output = { readonly thickness: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gasConstant: { type: "number", exclusiveMinimum: 0 },
    virtualTemperature: { type: "number", exclusiveMinimum: 0 },
    gravity: { type: "number", exclusiveMinimum: 0 },
    lowerPressure: { type: "number", exclusiveMinimum: 0 },
    upperPressure: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "gasConstant",
    "virtualTemperature",
    "gravity",
    "lowerPressure",
    "upperPressure",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { thickness: { type: "number" } },
  required: ["thickness"],
} as const;
/** Compute an isothermal-mean hypsometric layer thickness from explicit virtual temperature and compatible pressures. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    gasConstant,
    virtualTemperature,
    gravity,
    lowerPressure,
    upperPressure,
  } = request;
  const compute = (): Output => {
    H.positive(gasConstant);
    H.positive(virtualTemperature);
    H.positive(gravity);
    H.positive(lowerPressure);
    H.positive(upperPressure);
    return {
      thickness:
        ((gasConstant * virtualTemperature) / gravity) *
        Math.log(lowerPressure / upperPressure),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    gasConstant: 287,
    virtualTemperature: 280,
    gravity: 10,
    lowerPressure: 100000,
    upperPressure: 50000,
  },
  output: { thickness: 5570.130742979721 },
} satisfies ToolExample<Input, Output>;
export const hypsometricMeanVirtualTemperatureFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "atmospheric-science/hypsometric-mean-virtual-temperature-factor",
      title: "Hypsometric Mean Virtual Temperature Factor Tool",
      description:
        "Compute an isothermal-mean hypsometric layer thickness from explicit virtual temperature and compatible pressures.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          gasConstant: { type: "number", exclusiveMinimum: 0 },
          virtualTemperature: { type: "number", exclusiveMinimum: 0 },
          gravity: { type: "number", exclusiveMinimum: 0 },
          lowerPressure: { type: "number", exclusiveMinimum: 0 },
          upperPressure: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "gasConstant",
          "virtualTemperature",
          "gravity",
          "lowerPressure",
          "upperPressure",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { thickness: { type: "number" } },
        required: ["thickness"],
      },
      ports: {
        inputs: [
          {
            id: "gasConstant",
            label: "Gas Constant",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "virtualTemperature",
            label: "Virtual Temperature",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "gravity",
            label: "Gravity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lowerPressure",
            label: "Lower Pressure",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "upperPressure",
            label: "Upper Pressure",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "thickness",
            label: "Thickness",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = hypsometricMeanVirtualTemperatureFactorTool.execute;
export default hypsometricMeanVirtualTemperatureFactorTool;
