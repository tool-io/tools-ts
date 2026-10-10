import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedAngle: number;
  readonly positiveMeansExtension: boolean;
};
export type Output = { readonly extensionPositiveAngle: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedAngle: { type: "number" },
    positiveMeansExtension: { type: "boolean" },
  },
  required: ["recordedAngle", "positiveMeansExtension"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { extensionPositiveAngle: { type: "number" } },
  required: ["extensionPositiveAngle"],
} as const;
/** Crosswalk an explicit joint angle to extension-positive notation without choosing an anatomical zero or assessing motion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedAngle, positiveMeansExtension } = request;
  const compute = (): Output => {
    return {
      extensionPositiveAngle: recordedAngle * (positiveMeansExtension ? 1 : -1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedAngle: 10, positiveMeansExtension: true },
  output: { extensionPositiveAngle: 10 },
} satisfies ToolExample<Input, Output>;
export const jointRangeExtensionSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["orthopedics", "health and medicine"],
      keywords: ["orthopedics", "health and medicine"],
    },
    id: "orthopedics/joint-range-extension-sign",
    title: "Joint Range Extension Sign",
    description:
      "Crosswalk an explicit joint angle to extension-positive notation without choosing an anatomical zero or assessing motion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedAngle: { type: "number" },
        positiveMeansExtension: { type: "boolean" },
      },
      required: ["recordedAngle", "positiveMeansExtension"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { extensionPositiveAngle: { type: "number" } },
      required: ["extensionPositiveAngle"],
    },
    ports: {
      inputs: [
        {
          id: "recordedAngle",
          label: "Recorded Angle",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveMeansExtension",
          label: "Positive Means Extension",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "extensionPositiveAngle",
          label: "Extension Positive Angle",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = jointRangeExtensionSignTool.execute;
export default jointRangeExtensionSignTool;
