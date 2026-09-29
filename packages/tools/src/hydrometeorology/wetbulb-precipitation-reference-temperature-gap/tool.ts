import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetBulb: number;
  readonly dryBulb: number;
  readonly referenceWetBulb: number;
};
export type Output = {
  readonly depression: number;
  readonly referenceGap: number;
  readonly physicalOrder: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetBulb: { type: "number" },
    dryBulb: { type: "number" },
    referenceWetBulb: { type: "number" },
  },
  required: ["wetBulb", "dryBulb", "referenceWetBulb"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depression: { type: "number" },
    referenceGap: { type: "number" },
    physicalOrder: { type: "boolean" },
  },
  required: ["depression", "referenceGap", "physicalOrder"],
} as const;
/** Compare caller-supplied wet/dry-bulb observations; no psychrometric wet-bulb estimate or weather classification is made. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetBulb, dryBulb, referenceWetBulb } = request;
  const compute = (): Output => {
    return {
      depression: dryBulb - wetBulb,
      referenceGap: wetBulb - referenceWetBulb,
      physicalOrder: wetBulb <= dryBulb,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetBulb: 1, dryBulb: 3, referenceWetBulb: 0 },
  output: { depression: 2, referenceGap: 1, physicalOrder: true },
} satisfies ToolExample<Input, Output>;
export const wetbulbPrecipitationReferenceTemperatureGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hydrometeorology/wetbulb-precipitation-reference-temperature-gap",
      title: "Wetbulb Precipitation Reference Temperature Gap Tool",
      description:
        "Compare caller-supplied wet/dry-bulb observations; no psychrometric wet-bulb estimate or weather classification is made.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          wetBulb: { type: "number" },
          dryBulb: { type: "number" },
          referenceWetBulb: { type: "number" },
        },
        required: ["wetBulb", "dryBulb", "referenceWetBulb"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          depression: { type: "number" },
          referenceGap: { type: "number" },
          physicalOrder: { type: "boolean" },
        },
        required: ["depression", "referenceGap", "physicalOrder"],
      },
      ports: {
        inputs: [
          {
            id: "wetBulb",
            label: "Wet Bulb",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "dryBulb",
            label: "Dry Bulb",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceWetBulb",
            label: "Reference Wet Bulb",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "depression",
            label: "Depression",
            valueType: { type: "number" },
          },
          {
            id: "referenceGap",
            label: "Reference Gap",
            valueType: { type: "number" },
          },
          {
            id: "physicalOrder",
            label: "Physical Order",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = wetbulbPrecipitationReferenceTemperatureGapTool.execute;
export default wetbulbPrecipitationReferenceTemperatureGapTool;
