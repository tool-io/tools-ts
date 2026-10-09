import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly facadeWording: string;
  readonly measurementSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    facadeWording: { type: "string", maxLength: 8192, minLength: 1 },
    measurementSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "facadeWording", "measurementSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit noise-observation facade/location wording without applying reflection or exposure corrections. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, facadeWording, measurementSource } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(facadeWording.length > 0, "facadeWording");
    H.domain(measurementSource.length > 0, "measurementSource");
    return {
      token: JSON.stringify([recordId, facadeWording, measurementSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "N17",
    facadeWording: "facade A",
    measurementSource: "Observer log",
  },
  output: { token: '["N17","facade A","Observer log"]' },
} satisfies ToolExample<Input, Output>;
export const noiseObservationFacadeLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "environmental-health",
        "environmental health",
        "health and medicine",
      ],
      keywords: ["environmental health", "health and medicine"],
    },
    id: "environmental-health/noise-observation-facade-label",
    title: "Noise Observation Facade Label",
    description:
      "Record explicit noise-observation facade/location wording without applying reflection or exposure corrections.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        facadeWording: { type: "string", maxLength: 8192, minLength: 1 },
        measurementSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "facadeWording", "measurementSource"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "facadeWording",
          label: "Facade Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "measurementSource",
          label: "Measurement Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = noiseObservationFacadeLabelTool.execute;
export default noiseObservationFacadeLabelTool;
