import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedMass: number;
  readonly harvestedArea: number;
  readonly totalArea: number;
  readonly moistureCorrection: number;
};
export type Output = { readonly plotEquivalent: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedMass: { type: "number", minimum: 0 },
    harvestedArea: { type: "number", exclusiveMinimum: 0 },
    totalArea: { type: "number" },
    moistureCorrection: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "observedMass",
    "harvestedArea",
    "totalArea",
    "moistureCorrection",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { plotEquivalent: { type: "number" } },
  required: ["plotEquivalent"],
} as const;
/** Calculate farm demo partial plot harvest factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedMass, harvestedArea, totalArea, moistureCorrection } =
    request;
  const compute = (): Output => {
    H.domain(observedMass >= 0 && totalArea >= harvestedArea);
    H.positive(harvestedArea);
    H.positive(moistureCorrection);
    return {
      plotEquivalent:
        (observedMass * totalArea * moistureCorrection) / harvestedArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedMass: 10,
    harvestedArea: 5,
    totalArea: 20,
    moistureCorrection: 0.9,
  },
  output: { plotEquivalent: 36 },
} satisfies ToolExample<Input, Output>;
export const farmDemoPartialPlotHarvestFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-extension/farm-demo-partial-plot-harvest-factor",
    title: "Farm Demo Partial Plot Harvest Factor Tool",
    description:
      "Calculate farm demo partial plot harvest factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedMass: { type: "number", minimum: 0 },
        harvestedArea: { type: "number", exclusiveMinimum: 0 },
        totalArea: { type: "number" },
        moistureCorrection: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "observedMass",
        "harvestedArea",
        "totalArea",
        "moistureCorrection",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { plotEquivalent: { type: "number" } },
      required: ["plotEquivalent"],
    },
    ports: {
      inputs: [
        {
          id: "observedMass",
          label: "Observed Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "harvestedArea",
          label: "Harvested Area",
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
          id: "moistureCorrection",
          label: "Moisture Correction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "plotEquivalent",
          label: "Plot Equivalent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmDemoPartialPlotHarvestFactorTool.execute;
export default farmDemoPartialPlotHarvestFactorTool;
