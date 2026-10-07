import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly temperatureKelvin: number;
  readonly specificHumidityFraction: number;
  readonly suppliedVaporToDryGasConstantRatio: number;
};
export type Output = {
  readonly virtualTemperatureKelvin: number;
  readonly factor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    temperatureKelvin: { type: "number", exclusiveMinimum: 0 },
    specificHumidityFraction: { type: "number", minimum: 0, maximum: 1 },
    suppliedVaporToDryGasConstantRatio: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "temperatureKelvin",
    "specificHumidityFraction",
    "suppliedVaporToDryGasConstantRatio",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    virtualTemperatureKelvin: { type: "number" },
    factor: { type: "number" },
  },
  required: ["virtualTemperatureKelvin", "factor"],
} as const;
/** Apply an explicit specific-humidity ideal gas-mixture virtual-temperature factor using a supplied vapor-to-dry-air gas-constant ratio and no condensate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    temperatureKelvin,
    specificHumidityFraction,
    suppliedVaporToDryGasConstantRatio,
  } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(temperatureKelvin) && temperatureKelvin > 0,
      "temperatureKelvin",
    ),
      temperatureKelvin);
    (H.domain(
      specificHumidityFraction >= 0 && specificHumidityFraction <= 1,
      "specificHumidityFraction",
    ),
      specificHumidityFraction);
    (H.domain(
      Number.isFinite(suppliedVaporToDryGasConstantRatio) &&
        suppliedVaporToDryGasConstantRatio > 0,
      "suppliedVaporToDryGasConstantRatio",
    ),
      suppliedVaporToDryGasConstantRatio);
    return {
      virtualTemperatureKelvin:
        temperatureKelvin *
        (1 +
          (suppliedVaporToDryGasConstantRatio - 1) * specificHumidityFraction),
      factor:
        1 + (suppliedVaporToDryGasConstantRatio - 1) * specificHumidityFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    temperatureKelvin: 300,
    specificHumidityFraction: 0.01,
    suppliedVaporToDryGasConstantRatio: 1.6,
  },
  output: { virtualTemperatureKelvin: 301.8, factor: 1.006 },
} satisfies ToolExample<Input, Output>;
export const virtualTemperatureSingleHumidityFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: [
          "atmospheric-science",
          "atmospheric science",
          "earth and environmental sciences",
        ],
        keywords: ["atmospheric science", "earth and environmental sciences"],
      },
      id: "atmospheric-science/virtual-temperature-single-humidity-factor",
      title: "Virtual Temperature Single Humidity Factor",
      description:
        "Apply an explicit specific-humidity ideal gas-mixture virtual-temperature factor using a supplied vapor-to-dry-air gas-constant ratio and no condensate.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          temperatureKelvin: { type: "number", exclusiveMinimum: 0 },
          specificHumidityFraction: { type: "number", minimum: 0, maximum: 1 },
          suppliedVaporToDryGasConstantRatio: {
            type: "number",
            exclusiveMinimum: 0,
          },
        },
        required: [
          "temperatureKelvin",
          "specificHumidityFraction",
          "suppliedVaporToDryGasConstantRatio",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          virtualTemperatureKelvin: { type: "number" },
          factor: { type: "number" },
        },
        required: ["virtualTemperatureKelvin", "factor"],
      },
      ports: {
        inputs: [
          {
            id: "temperatureKelvin",
            label: "Temperature Kelvin",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "specificHumidityFraction",
            label: "Specific Humidity Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedVaporToDryGasConstantRatio",
            label: "Supplied Vapor To Dry Gas Constant Ratio",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "virtualTemperatureKelvin",
            label: "Virtual Temperature Kelvin",
            valueType: { type: "number" },
          },
          { id: "factor", label: "Factor", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = virtualTemperatureSingleHumidityFactorTool.execute;
export default virtualTemperatureSingleHumidityFactorTool;
