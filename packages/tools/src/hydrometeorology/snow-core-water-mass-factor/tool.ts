import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly waterMass: number;
  readonly coreArea: number;
  readonly waterDensity: number;
};
export type Output = { readonly waterEquivalentDepth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waterMass: { type: "number", minimum: 0 },
    coreArea: { type: "number", exclusiveMinimum: 0 },
    waterDensity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["waterMass", "coreArea", "waterDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { waterEquivalentDepth: { type: "number" } },
  required: ["waterEquivalentDepth"],
} as const;
/** Calculate snow core water mass factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { waterMass, coreArea, waterDensity } = request;
  const compute = (): Output => {
    H.domain(waterMass >= 0);
    H.positive(coreArea);
    H.positive(waterDensity);
    return { waterEquivalentDepth: waterMass / coreArea / waterDensity };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { waterMass: 2, coreArea: 0.01, waterDensity: 1000 },
  output: { waterEquivalentDepth: 0.2 },
} satisfies ToolExample<Input, Output>;
export const snowCoreWaterMassFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/snow-core-water-mass-factor",
    title: "Snow Core Water Mass Factor Tool",
    description:
      "Calculate snow core water mass factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waterMass: { type: "number", minimum: 0 },
        coreArea: { type: "number", exclusiveMinimum: 0 },
        waterDensity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["waterMass", "coreArea", "waterDensity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { waterEquivalentDepth: { type: "number" } },
      required: ["waterEquivalentDepth"],
    },
    ports: {
      inputs: [
        {
          id: "waterMass",
          label: "Water Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coreArea",
          label: "Core Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterDensity",
          label: "Water Density",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "waterEquivalentDepth",
          label: "Water Equivalent Depth",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = snowCoreWaterMassFactorTool.execute;
export default snowCoreWaterMassFactorTool;
