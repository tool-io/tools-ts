import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly envelopeVolume: number;
  readonly suppliedSolidVolume: number;
};
export type Output = {
  readonly voidVolume: number;
  readonly geometricPorosity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    envelopeVolume: { type: "number", exclusiveMinimum: 0 },
    suppliedSolidVolume: { type: "number", minimum: 0 },
  },
  required: ["envelopeVolume", "suppliedSolidVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voidVolume: { type: "number" },
    geometricPorosity: { type: "number" },
  },
  required: ["voidVolume", "geometricPorosity"],
} as const;
/** Calculate geometric void fraction from explicit envelope and solid volumes without modeling connectivity or biological performance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { envelopeVolume, suppliedSolidVolume } = request;
  const compute = (): Output => {
    (H.domain(envelopeVolume > 0, "envelopeVolume"), envelopeVolume);
    H.domain(
      suppliedSolidVolume >= 0 && suppliedSolidVolume <= envelopeVolume,
      "suppliedSolidVolume",
    );
    return {
      voidVolume: envelopeVolume - suppliedSolidVolume,
      geometricPorosity: 1 - suppliedSolidVolume / envelopeVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { envelopeVolume: 100, suppliedSolidVolume: 25 },
  output: { voidVolume: 75, geometricPorosity: 0.75 },
} satisfies ToolExample<Input, Output>;
export const scaffoldGeometricPorosityInputTool = H.defineSchemaCalculation<
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
    id: "biofabrication/scaffold-geometric-porosity-input",
    title: "Scaffold Geometric Porosity Input",
    description:
      "Calculate geometric void fraction from explicit envelope and solid volumes without modeling connectivity or biological performance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        envelopeVolume: { type: "number", exclusiveMinimum: 0 },
        suppliedSolidVolume: { type: "number", minimum: 0 },
      },
      required: ["envelopeVolume", "suppliedSolidVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        voidVolume: { type: "number" },
        geometricPorosity: { type: "number" },
      },
      required: ["voidVolume", "geometricPorosity"],
    },
    ports: {
      inputs: [
        {
          id: "envelopeVolume",
          label: "Envelope Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedSolidVolume",
          label: "Supplied Solid Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "voidVolume",
          label: "Void Volume",
          valueType: { type: "number" },
        },
        {
          id: "geometricPorosity",
          label: "Geometric Porosity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = scaffoldGeometricPorosityInputTool.execute;
export default scaffoldGeometricPorosityInputTool;
