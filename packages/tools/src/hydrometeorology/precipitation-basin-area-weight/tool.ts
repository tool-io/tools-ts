import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly subarea: number;
  readonly totalBasinArea: number;
  readonly subareaDepth: number;
};
export type Output = {
  readonly areaWeight: number;
  readonly basinDepthContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    subarea: { type: "number", minimum: 0 },
    totalBasinArea: { type: "number", exclusiveMinimum: 0 },
    subareaDepth: { type: "number", minimum: 0 },
  },
  required: ["subarea", "totalBasinArea", "subareaDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areaWeight: { type: "number" },
    basinDepthContribution: { type: "number" },
  },
  required: ["areaWeight", "basinDepthContribution"],
} as const;
/** Return one explicitly supplied subarea precipitation contribution to a compatible total basin area. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { subarea, totalBasinArea, subareaDepth } = request;
  const compute = (): Output => {
    (H.domain(totalBasinArea > 0, "totalBasinArea"), totalBasinArea);
    H.domain(
      subarea >= 0 && subarea <= totalBasinArea && subareaDepth >= 0,
      "subarea",
    );
    return {
      areaWeight: subarea / totalBasinArea,
      basinDepthContribution: (subarea / totalBasinArea) * subareaDepth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { subarea: 25, totalBasinArea: 100, subareaDepth: 20 },
  output: { areaWeight: 0.25, basinDepthContribution: 5 },
} satisfies ToolExample<Input, Output>;
export const precipitationBasinAreaWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["hydrometeorology", "earth and environmental sciences"],
      keywords: ["hydrometeorology", "earth and environmental sciences"],
    },
    id: "hydrometeorology/precipitation-basin-area-weight",
    title: "Precipitation Basin Area Weight",
    description:
      "Return one explicitly supplied subarea precipitation contribution to a compatible total basin area.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        subarea: { type: "number", minimum: 0 },
        totalBasinArea: { type: "number", exclusiveMinimum: 0 },
        subareaDepth: { type: "number", minimum: 0 },
      },
      required: ["subarea", "totalBasinArea", "subareaDepth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        areaWeight: { type: "number" },
        basinDepthContribution: { type: "number" },
      },
      required: ["areaWeight", "basinDepthContribution"],
    },
    ports: {
      inputs: [
        {
          id: "subarea",
          label: "Subarea",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalBasinArea",
          label: "Total Basin Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "subareaDepth",
          label: "Subarea Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "areaWeight",
          label: "Area Weight",
          valueType: { type: "number" },
        },
        {
          id: "basinDepthContribution",
          label: "Basin Depth Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = precipitationBasinAreaWeightTool.execute;
export default precipitationBasinAreaWeightTool;
