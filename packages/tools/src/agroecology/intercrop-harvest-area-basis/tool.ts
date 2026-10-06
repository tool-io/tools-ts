import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly harvestMass: number;
  readonly plotArea: number;
  readonly cropAllocatedArea: number;
};
export type Output = {
  readonly massPerWholePlotArea: number;
  readonly massPerAllocatedArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    harvestMass: { type: "number", minimum: 0 },
    plotArea: { type: "number", exclusiveMinimum: 0 },
    cropAllocatedArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["harvestMass", "plotArea", "cropAllocatedArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    massPerWholePlotArea: { type: "number" },
    massPerAllocatedArea: { type: "number" },
  },
  required: ["massPerWholePlotArea", "massPerAllocatedArea"],
} as const;
/** Report a supplied intercrop harvest on whole-plot and explicitly allocated crop-area bases. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { harvestMass, plotArea, cropAllocatedArea } = request;
  const compute = (): Output => {
    H.domain(harvestMass >= 0, "harvestMass");
    (H.domain(Number.isFinite(plotArea) && plotArea > 0, "plotArea"), plotArea);
    H.domain(
      cropAllocatedArea > 0 && cropAllocatedArea <= plotArea,
      "cropAllocatedArea",
    );
    return {
      massPerWholePlotArea: harvestMass / plotArea,
      massPerAllocatedArea: harvestMass / cropAllocatedArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { harvestMass: 60, plotArea: 20, cropAllocatedArea: 10 },
  output: { massPerWholePlotArea: 3, massPerAllocatedArea: 6 },
} satisfies ToolExample<Input, Output>;
export const intercropHarvestAreaBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroecology", "agriculture"],
      keywords: ["agroecology", "agriculture"],
    },
    id: "agroecology/intercrop-harvest-area-basis",
    title: "Intercrop Harvest Area Basis",
    description:
      "Report a supplied intercrop harvest on whole-plot and explicitly allocated crop-area bases.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        harvestMass: { type: "number", minimum: 0 },
        plotArea: { type: "number", exclusiveMinimum: 0 },
        cropAllocatedArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["harvestMass", "plotArea", "cropAllocatedArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        massPerWholePlotArea: { type: "number" },
        massPerAllocatedArea: { type: "number" },
      },
      required: ["massPerWholePlotArea", "massPerAllocatedArea"],
    },
    ports: {
      inputs: [
        {
          id: "harvestMass",
          label: "Harvest Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plotArea",
          label: "Plot Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cropAllocatedArea",
          label: "Crop Allocated Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "massPerWholePlotArea",
          label: "Mass Per Whole Plot Area",
          valueType: { type: "number" },
        },
        {
          id: "massPerAllocatedArea",
          label: "Mass Per Allocated Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = intercropHarvestAreaBasisTool.execute;
export default intercropHarvestAreaBasisTool;
