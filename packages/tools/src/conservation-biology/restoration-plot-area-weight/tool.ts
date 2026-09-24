import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plotArea: number;
  readonly totalArea: number;
  readonly observedCount: number;
};
export type Output = {
  readonly areaShare: number;
  readonly weightedCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plotArea: { type: "number", minimum: 0 },
    totalArea: { type: "number", exclusiveMinimum: 0 },
    observedCount: { type: "integer", minimum: 0 },
  },
  required: ["plotArea", "totalArea", "observedCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areaShare: { type: "number" },
    weightedCount: { type: "number" },
  },
  required: ["areaShare", "weightedCount"],
} as const;
/** Calculate restoration plot area weight from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plotArea, totalArea, observedCount } = request;
  const compute = (): Output => {
    H.positive(totalArea);
    H.domain(plotArea >= 0 && plotArea <= totalArea);
    H.integer(observedCount, 0);
    return {
      areaShare: plotArea / totalArea,
      weightedCount: (observedCount * plotArea) / totalArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plotArea: 2, totalArea: 10, observedCount: 20 },
  output: { areaShare: 0.2, weightedCount: 4 },
} satisfies ToolExample<Input, Output>;
export const restorationPlotAreaWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "conservation-biology/restoration-plot-area-weight",
    title: "Restoration Plot Area Weight Tool",
    description:
      "Calculate restoration plot area weight from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plotArea: { type: "number", minimum: 0 },
        totalArea: { type: "number", exclusiveMinimum: 0 },
        observedCount: { type: "integer", minimum: 0 },
      },
      required: ["plotArea", "totalArea", "observedCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        areaShare: { type: "number" },
        weightedCount: { type: "number" },
      },
      required: ["areaShare", "weightedCount"],
    },
    ports: {
      inputs: [
        {
          id: "plotArea",
          label: "Plot Area",
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
          id: "observedCount",
          label: "Observed Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "areaShare", label: "Area Share", valueType: { type: "number" } },
        {
          id: "weightedCount",
          label: "Weighted Count",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = restorationPlotAreaWeightTool.execute;
export default restorationPlotAreaWeightTool;
