import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gasName: string;
  readonly temperatureCelsius: number;
  readonly referencePressurePa: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gasName: { type: "string", maxLength: 8192, minLength: 1 },
    temperatureCelsius: { type: "number", exclusiveMinimum: -273.15 },
    referencePressurePa: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["gasName", "temperatureCelsius", "referencePressurePa"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied gas measurement temperature/pressure reference without converting solubility or gas volume. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gasName, temperatureCelsius, referencePressurePa } = request;
  const compute = (): Output => {
    H.domain(gasName.length > 0 && temperatureCelsius > -273.15, "gasName");
    (H.domain(referencePressurePa > 0, "referencePressurePa"),
      referencePressurePa);
    return {
      label:
        gasName +
        "; reference " +
        temperatureCelsius +
        " °C, " +
        referencePressurePa +
        " Pa",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    gasName: "oxygen",
    temperatureCelsius: 20,
    referencePressurePa: 101325,
  },
  output: { label: "oxygen; reference 20 °C, 101325 Pa" },
} satisfies ToolExample<Input, Output>;
export const aquaticGasTemperatureReferenceLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: [
          "aquatic-science",
          "aquatic science",
          "earth and environmental sciences",
        ],
        keywords: ["aquatic science", "earth and environmental sciences"],
      },
      id: "aquatic-science/aquatic-gas-temperature-reference-label",
      title: "Aquatic Gas Temperature Reference Label",
      description:
        "Label an explicitly supplied gas measurement temperature/pressure reference without converting solubility or gas volume.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          gasName: { type: "string", maxLength: 8192, minLength: 1 },
          temperatureCelsius: { type: "number", exclusiveMinimum: -273.15 },
          referencePressurePa: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["gasName", "temperatureCelsius", "referencePressurePa"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string", maxLength: 8192 } },
        required: ["label"],
      },
      ports: {
        inputs: [
          {
            id: "gasName",
            label: "Gas Name",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "temperatureCelsius",
            label: "Temperature Celsius",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referencePressurePa",
            label: "Reference Pressure Pa",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = aquaticGasTemperatureReferenceLabelTool.execute;
export default aquaticGasTemperatureReferenceLabelTool;
