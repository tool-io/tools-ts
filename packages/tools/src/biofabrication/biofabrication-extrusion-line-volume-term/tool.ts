import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lineLengths: readonly number[];
  readonly crossSectionArea: number;
  readonly depositedFraction: number;
};
export type Output = {
  readonly nominalVolume: number;
  readonly depositedVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lineLengths: { type: "array", maxItems: 256, items: { type: "number" } },
    crossSectionArea: { type: "number", minimum: 0 },
    depositedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["lineLengths", "crossSectionArea", "depositedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalVolume: { type: "number" },
    depositedVolume: { type: "number" },
  },
  required: ["nominalVolume", "depositedVolume"],
} as const;
/** Geometric model volume from supplied line lengths and deposited fraction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lineLengths, crossSectionArea, depositedFraction } = request;
  const compute = (): Output => {
    H.domain(lineLengths.every((x) => x >= 0) && crossSectionArea >= 0);
    H.probability(depositedFraction);
    return {
      nominalVolume: lineLengths.reduce((a, b) => a + b, 0) * crossSectionArea,
      depositedVolume:
        lineLengths.reduce((a, b) => a + b, 0) *
        crossSectionArea *
        depositedFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lineLengths: [10, 20, 30],
    crossSectionArea: 0.2,
    depositedFraction: 0.8,
  },
  output: { nominalVolume: 12, depositedVolume: 9.600000000000001 },
} satisfies ToolExample<Input, Output>;
export const biofabricationExtrusionLineVolumeTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biofabrication/biofabrication-extrusion-line-volume-term",
      title: "Biofabrication Extrusion Line Volume Term Tool",
      description:
        "Geometric model volume from supplied line lengths and deposited fraction.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lineLengths: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          crossSectionArea: { type: "number", minimum: 0 },
          depositedFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["lineLengths", "crossSectionArea", "depositedFraction"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          nominalVolume: { type: "number" },
          depositedVolume: { type: "number" },
        },
        required: ["nominalVolume", "depositedVolume"],
      },
      ports: {
        inputs: [
          {
            id: "lineLengths",
            label: "Line Lengths",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "crossSectionArea",
            label: "Cross Section Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "depositedFraction",
            label: "Deposited Fraction",
            required: true,
            valueType: { type: "number", unit: "1" },
          },
        ],
        outputs: [
          {
            id: "nominalVolume",
            label: "Nominal Volume",
            valueType: { type: "number" },
          },
          {
            id: "depositedVolume",
            label: "Deposited Volume",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biofabricationExtrusionLineVolumeTermTool.execute;
export default biofabricationExtrusionLineVolumeTermTool;
