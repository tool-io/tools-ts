import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dieDiameter: number;
  readonly extrudateDiameter: number;
};
export type Output = {
  readonly areaRatio: number;
  readonly diameterRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dieDiameter: { type: "number", exclusiveMinimum: 0 },
    extrudateDiameter: { type: "number", minimum: 0 },
  },
  required: ["dieDiameter", "extrudateDiameter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areaRatio: { type: "number" },
    diameterRatio: { type: "number" },
  },
  required: ["areaRatio", "diameterRatio"],
} as const;
/** Calculate food extrusion expansion area ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dieDiameter, extrudateDiameter } = request;
  const compute = (): Output => {
    H.positive(dieDiameter);
    H.domain(extrudateDiameter >= 0);
    return {
      areaRatio: (extrudateDiameter / dieDiameter) ** 2,
      diameterRatio: extrudateDiameter / dieDiameter,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dieDiameter: 2, extrudateDiameter: 4 },
  output: { areaRatio: 4, diameterRatio: 2 },
} satisfies ToolExample<Input, Output>;
export const foodExtrusionExpansionAreaRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-technology/food-extrusion-expansion-area-ratio",
    title: "Food Extrusion Expansion Area Ratio Tool",
    description:
      "Calculate food extrusion expansion area ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dieDiameter: { type: "number", exclusiveMinimum: 0 },
        extrudateDiameter: { type: "number", minimum: 0 },
      },
      required: ["dieDiameter", "extrudateDiameter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        areaRatio: { type: "number" },
        diameterRatio: { type: "number" },
      },
      required: ["areaRatio", "diameterRatio"],
    },
    ports: {
      inputs: [
        {
          id: "dieDiameter",
          label: "Die Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "extrudateDiameter",
          label: "Extrudate Diameter",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "areaRatio",
          label: "Area Ratio",
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "diameterRatio",
          label: "Diameter Ratio",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodExtrusionExpansionAreaRatioTool.execute;
export default foodExtrusionExpansionAreaRatioTool;
