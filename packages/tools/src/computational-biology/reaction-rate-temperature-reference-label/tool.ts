import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reactionId: string;
  readonly temperatureText: string;
  readonly modelSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reactionId: { type: "string", maxLength: 8192, minLength: 1 },
    temperatureText: { type: "string", maxLength: 8192, minLength: 1 },
    modelSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["reactionId", "temperatureText", "modelSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit reaction-rate reference temperature metadata without applying a temperature law. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reactionId, temperatureText, modelSource } = request;
  const compute = (): Output => {
    H.domain(reactionId.length > 0, "reactionId");
    H.domain(temperatureText.length > 0, "temperatureText");
    H.domain(modelSource.length > 0, "modelSource");
    return {
      token: JSON.stringify([reactionId, temperatureText, modelSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reactionId: "R17",
    temperatureText: "298.15 K",
    modelSource: "model M4",
  },
  output: { token: '["R17","298.15 K","model M4"]' },
} satisfies ToolExample<Input, Output>;
export const reactionRateTemperatureReferenceLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["computational-biology", "computational biology", "biology"],
        keywords: ["computational biology", "biology"],
      },
      id: "computational-biology/reaction-rate-temperature-reference-label",
      title: "Reaction Rate Temperature Reference Label",
      description:
        "Record explicit reaction-rate reference temperature metadata without applying a temperature law.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reactionId: { type: "string", maxLength: 8192, minLength: 1 },
          temperatureText: { type: "string", maxLength: 8192, minLength: 1 },
          modelSource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["reactionId", "temperatureText", "modelSource"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      ports: {
        inputs: [
          {
            id: "reactionId",
            label: "Reaction Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "temperatureText",
            label: "Temperature Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "modelSource",
            label: "Model Source",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = reactionRateTemperatureReferenceLabelTool.execute;
export default reactionRateTemperatureReferenceLabelTool;
