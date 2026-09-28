import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mappedLength: number;
  readonly lengthScale: number;
  readonly mappedArea: number;
  readonly areaScale: number;
};
export type Output = {
  readonly physicalLength: number;
  readonly physicalArea: number;
  readonly drainageDensity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mappedLength: { type: "number", minimum: 0 },
    lengthScale: { type: "number", exclusiveMinimum: 0 },
    mappedArea: { type: "number", exclusiveMinimum: 0 },
    areaScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["mappedLength", "lengthScale", "mappedArea", "areaScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    physicalLength: { type: "number" },
    physicalArea: { type: "number" },
    drainageDensity: { type: "number" },
  },
  required: ["physicalLength", "physicalArea", "drainageDensity"],
} as const;
/** Drainage density in matched physical length/area units; areaScale is an area conversion factor, not a linear map scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mappedLength, lengthScale, mappedArea, areaScale } = request;
  const compute = (): Output => {
    H.domain(mappedLength >= 0);
    H.positive(lengthScale);
    H.positive(mappedArea);
    H.positive(areaScale);
    return {
      physicalLength: mappedLength * lengthScale,
      physicalArea: mappedArea * areaScale,
      drainageDensity: (mappedLength * lengthScale) / (mappedArea * areaScale),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mappedLength: 10, lengthScale: 2, mappedArea: 5, areaScale: 4 },
  output: { physicalLength: 20, physicalArea: 20, drainageDensity: 1 },
} satisfies ToolExample<Input, Output>;
export const drainageDensityMapLengthAreaFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/drainage-density-map-length-area-factor",
    title: "Drainage Density Map Length Area Factor Tool",
    description:
      "Drainage density in matched physical length/area units; areaScale is an area conversion factor, not a linear map scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mappedLength: { type: "number", minimum: 0 },
        lengthScale: { type: "number", exclusiveMinimum: 0 },
        mappedArea: { type: "number", exclusiveMinimum: 0 },
        areaScale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["mappedLength", "lengthScale", "mappedArea", "areaScale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        physicalLength: { type: "number" },
        physicalArea: { type: "number" },
        drainageDensity: { type: "number" },
      },
      required: ["physicalLength", "physicalArea", "drainageDensity"],
    },
    ports: {
      inputs: [
        {
          id: "mappedLength",
          label: "Mapped Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lengthScale",
          label: "Length Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "mappedArea",
          label: "Mapped Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "areaScale",
          label: "Area Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "physicalLength",
          label: "Physical Length",
          valueType: { type: "number" },
        },
        {
          id: "physicalArea",
          label: "Physical Area",
          valueType: { type: "number" },
        },
        {
          id: "drainageDensity",
          label: "Drainage Density",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = drainageDensityMapLengthAreaFactorTool.execute;
export default drainageDensityMapLengthAreaFactorTool;
