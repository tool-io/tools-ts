import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceTemperature: number;
  readonly measuredTemperature: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceTemperature: { type: "number" },
    measuredTemperature: { type: "number" },
  },
  required: ["referenceTemperature", "measuredTemperature"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract supplied reference from measured cover-object temperature in the same scale without habitat suitability inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceTemperature, measuredTemperature } = request;
  const compute = (): Output => {
    return { signedGap: measuredTemperature - referenceTemperature };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceTemperature: 12, measuredTemperature: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const coverObjectTemperatureReferenceOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "herpetology/cover-object-temperature-reference-offset",
      title: "Cover Object Temperature Reference Offset Tool",
      description:
        "Subtract supplied reference from measured cover-object temperature in the same scale without habitat suitability inference.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          referenceTemperature: { type: "number" },
          measuredTemperature: { type: "number" },
        },
        required: ["referenceTemperature", "measuredTemperature"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { signedGap: { type: "number" } },
        required: ["signedGap"],
      },
      ports: {
        inputs: [
          {
            id: "referenceTemperature",
            label: "Reference Temperature",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "measuredTemperature",
            label: "Measured Temperature",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "signedGap",
            label: "Signed Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = coverObjectTemperatureReferenceOffsetTool.execute;
export default coverObjectTemperatureReferenceOffsetTool;
