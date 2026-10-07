import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly temperature: number;
  readonly referenceTemperature: number;
};
export type Output = { readonly temperatureDifference: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    temperature: { type: "number" },
    referenceTemperature: { type: "number" },
  },
  required: ["temperature", "referenceTemperature"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { temperatureDifference: { type: "number" } },
  required: ["temperatureDifference"],
} as const;
/** Return a signed process-stream temperature difference in one common degree scale without converting Celsius to kelvin. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { temperature, referenceTemperature } = request;
  const compute = (): Output => {
    return { temperatureDifference: temperature - referenceTemperature };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { temperature: 80, referenceTemperature: 25 },
  output: { temperatureDifference: 55 },
} satisfies ToolExample<Input, Output>;
export const processStreamTemperatureReferenceOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["chemical-engineering", "chemical engineering", "engineering"],
        keywords: ["chemical engineering", "engineering"],
      },
      id: "chemical-engineering/process-stream-temperature-reference-offset",
      title: "Process Stream Temperature Reference Offset",
      description:
        "Return a signed process-stream temperature difference in one common degree scale without converting Celsius to kelvin.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          temperature: { type: "number" },
          referenceTemperature: { type: "number" },
        },
        required: ["temperature", "referenceTemperature"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { temperatureDifference: { type: "number" } },
        required: ["temperatureDifference"],
      },
      ports: {
        inputs: [
          {
            id: "temperature",
            label: "Temperature",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceTemperature",
            label: "Reference Temperature",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "temperatureDifference",
            label: "Temperature Difference",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = processStreamTemperatureReferenceOffsetTool.execute;
export default processStreamTemperatureReferenceOffsetTool;
