import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly heatRate: number;
  readonly projectedArea: number;
  readonly totalArea: number;
  readonly useProjected: boolean;
};
export type Output = { readonly flux: number; readonly areaRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heatRate: { type: "number" },
    projectedArea: { type: "number", exclusiveMinimum: 0 },
    totalArea: { type: "number", exclusiveMinimum: 0 },
    useProjected: { type: "boolean" },
  },
  required: ["heatRate", "projectedArea", "totalArea", "useProjected"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { flux: { type: "number" }, areaRatio: { type: "number" } },
  required: ["flux", "areaRatio"],
} as const;
/** Use explicitly supplied projected or total area as the heat-flux denominator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { heatRate, projectedArea, totalArea, useProjected } = request;
  const compute = (): Output => {
    H.positive(projectedArea);
    H.positive(totalArea);
    return {
      flux: heatRate / (useProjected ? projectedArea : totalArea),
      areaRatio: projectedArea / totalArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { heatRate: 100, projectedArea: 2, totalArea: 5, useProjected: true },
  output: { flux: 50, areaRatio: 0.4 },
} satisfies ToolExample<Input, Output>;
export const thermalBalanceReferenceAreaFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiology/thermal-balance-reference-area-flag",
    title: "Thermal Balance Reference Area Flag Tool",
    description:
      "Use explicitly supplied projected or total area as the heat-flux denominator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        heatRate: { type: "number" },
        projectedArea: { type: "number", exclusiveMinimum: 0 },
        totalArea: { type: "number", exclusiveMinimum: 0 },
        useProjected: { type: "boolean" },
      },
      required: ["heatRate", "projectedArea", "totalArea", "useProjected"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { flux: { type: "number" }, areaRatio: { type: "number" } },
      required: ["flux", "areaRatio"],
    },
    ports: {
      inputs: [
        {
          id: "heatRate",
          label: "Heat Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "projectedArea",
          label: "Projected Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalArea",
          label: "Total Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "useProjected",
          label: "Use Projected",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "flux", label: "Flux", valueType: { type: "number" } },
        { id: "areaRatio", label: "Area Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = thermalBalanceReferenceAreaFlagTool.execute;
export default thermalBalanceReferenceAreaFlagTool;
