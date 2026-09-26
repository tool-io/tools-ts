import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly area: number;
  readonly compactedThickness: number;
  readonly looseToCompactedRatio: number;
};
export type Output = {
  readonly compactedVolume: number;
  readonly looseVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number", minimum: 0 },
    compactedThickness: { type: "number", minimum: 0 },
    looseToCompactedRatio: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["area", "compactedThickness", "looseToCompactedRatio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    compactedVolume: { type: "number" },
    looseVolume: { type: "number" },
  },
  required: ["compactedVolume", "looseVolume"],
} as const;
/** Calculate landfill cover soil volume term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { area, compactedThickness, looseToCompactedRatio } = request;
  const compute = (): Output => {
    H.domain(area >= 0 && compactedThickness >= 0);
    H.positive(looseToCompactedRatio);
    return {
      compactedVolume: area * compactedThickness,
      looseVolume: area * compactedThickness * looseToCompactedRatio,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { area: 1000, compactedThickness: 0.15, looseToCompactedRatio: 1.2 },
  output: { compactedVolume: 150, looseVolume: 180 },
} satisfies ToolExample<Input, Output>;
export const landfillCoverSoilVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/landfill-cover-soil-volume-term",
    title: "Landfill Cover Soil Volume Term Tool",
    description:
      "Calculate landfill cover soil volume term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        area: { type: "number", minimum: 0 },
        compactedThickness: { type: "number", minimum: 0 },
        looseToCompactedRatio: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["area", "compactedThickness", "looseToCompactedRatio"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        compactedVolume: { type: "number" },
        looseVolume: { type: "number" },
      },
      required: ["compactedVolume", "looseVolume"],
    },
    ports: {
      inputs: [
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "compactedThickness",
          label: "Compacted Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "looseToCompactedRatio",
          label: "Loose To Compacted Ratio",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "compactedVolume",
          label: "Compacted Volume",
          valueType: { type: "number" },
        },
        {
          id: "looseVolume",
          label: "Loose Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = landfillCoverSoilVolumeTermTool.execute;
export default landfillCoverSoilVolumeTermTool;
