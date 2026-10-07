import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nominalLayerHeight: number;
  readonly measuredLayerHeight: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalLayerHeight: { type: "number" },
    measuredLayerHeight: { type: "number" },
  },
  required: ["nominalLayerHeight", "measuredLayerHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit nominal layer height from measured layer height on a compatible length basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nominalLayerHeight, measuredLayerHeight } = request;
  const compute = (): Output => {
    return { signedGap: measuredLayerHeight - nominalLayerHeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nominalLayerHeight: 12, measuredLayerHeight: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const biofabricationLayerHeightOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biofabrication", "engineering"],
      keywords: ["biofabrication", "engineering"],
    },
    id: "biofabrication/biofabrication-layer-height-offset",
    title: "Biofabrication Layer Height Offset",
    description:
      "Subtract explicit nominal layer height from measured layer height on a compatible length basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalLayerHeight: { type: "number" },
        measuredLayerHeight: { type: "number" },
      },
      required: ["nominalLayerHeight", "measuredLayerHeight"],
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
          id: "nominalLayerHeight",
          label: "Nominal Layer Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredLayerHeight",
          label: "Measured Layer Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = biofabricationLayerHeightOffsetTool.execute;
export default biofabricationLayerHeightOffsetTool;
