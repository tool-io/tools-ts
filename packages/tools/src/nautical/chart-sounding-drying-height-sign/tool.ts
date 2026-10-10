import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly magnitude: number;
  readonly isDryingHeight: boolean;
  readonly positiveMeansDepth: boolean;
};
export type Output = { readonly signedOrdinate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    magnitude: { type: "number", minimum: 0 },
    isDryingHeight: { type: "boolean" },
    positiveMeansDepth: { type: "boolean" },
  },
  required: ["magnitude", "isDryingHeight", "positiveMeansDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedOrdinate: { type: "number" } },
  required: ["signedOrdinate"],
} as const;
/** Apply explicit sounding-versus-drying and depth sign flags to a supplied chart ordinate without resolving a vertical datum. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { magnitude, isDryingHeight, positiveMeansDepth } = request;
  const compute = (): Output => {
    H.domain(magnitude >= 0, "magnitude");
    return {
      signedOrdinate:
        magnitude * (isDryingHeight !== positiveMeansDepth ? 1 : -1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { magnitude: 2, isDryingHeight: false, positiveMeansDepth: true },
  output: { signedOrdinate: 2 },
} satisfies ToolExample<Input, Output>;
export const chartSoundingDryingHeightSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["nautical", "engineering"],
      keywords: ["nautical", "engineering"],
    },
    id: "nautical/chart-sounding-drying-height-sign",
    title: "Chart Sounding Drying Height Sign",
    description:
      "Apply explicit sounding-versus-drying and depth sign flags to a supplied chart ordinate without resolving a vertical datum.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        magnitude: { type: "number", minimum: 0 },
        isDryingHeight: { type: "boolean" },
        positiveMeansDepth: { type: "boolean" },
      },
      required: ["magnitude", "isDryingHeight", "positiveMeansDepth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedOrdinate: { type: "number" } },
      required: ["signedOrdinate"],
    },
    ports: {
      inputs: [
        {
          id: "magnitude",
          label: "Magnitude",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "isDryingHeight",
          label: "Is Drying Height",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "positiveMeansDepth",
          label: "Positive Means Depth",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "signedOrdinate",
          label: "Signed Ordinate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = chartSoundingDryingHeightSignTool.execute;
export default chartSoundingDryingHeightSignTool;
