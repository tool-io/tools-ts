import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly interiorSeeds: number;
  readonly edgeSeeds: number;
  readonly edgeWeight: number;
  readonly trapArea: number;
};
export type Output = {
  readonly weightedSeeds: number;
  readonly density: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    interiorSeeds: { type: "integer", minimum: 0 },
    edgeSeeds: { type: "integer", minimum: 0 },
    edgeWeight: { type: "number", minimum: 0, maximum: 1 },
    trapArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["interiorSeeds", "edgeSeeds", "edgeWeight", "trapArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedSeeds: { type: "number" },
    density: { type: "number" },
  },
  required: ["weightedSeeds", "density"],
} as const;
/** Calculate seed rain trap edge adjustment from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { interiorSeeds, edgeSeeds, edgeWeight, trapArea } = request;
  const compute = (): Output => {
    H.integer(interiorSeeds, 0);
    H.integer(edgeSeeds, 0);
    H.probability(edgeWeight);
    H.positive(trapArea);
    return {
      weightedSeeds: interiorSeeds + edgeSeeds * edgeWeight,
      density: (interiorSeeds + edgeSeeds * edgeWeight) / trapArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { interiorSeeds: 10, edgeSeeds: 4, edgeWeight: 0.5, trapArea: 2 },
  output: { weightedSeeds: 12, density: 6 },
} satisfies ToolExample<Input, Output>;
export const seedRainTrapEdgeAdjustmentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ecology/seed-rain-trap-edge-adjustment",
    title: "Seed Rain Trap Edge Adjustment Tool",
    description:
      "Calculate seed rain trap edge adjustment from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        interiorSeeds: { type: "integer", minimum: 0 },
        edgeSeeds: { type: "integer", minimum: 0 },
        edgeWeight: { type: "number", minimum: 0, maximum: 1 },
        trapArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["interiorSeeds", "edgeSeeds", "edgeWeight", "trapArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weightedSeeds: { type: "number" },
        density: { type: "number" },
      },
      required: ["weightedSeeds", "density"],
    },
    ports: {
      inputs: [
        {
          id: "interiorSeeds",
          label: "Interior Seeds",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "edgeSeeds",
          label: "Edge Seeds",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "edgeWeight",
          label: "Edge Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "trapArea",
          label: "Trap Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedSeeds",
          label: "Weighted Seeds",
          valueType: { type: "number" },
        },
        { id: "density", label: "Density", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = seedRainTrapEdgeAdjustmentTool.execute;
export default seedRainTrapEdgeAdjustmentTool;
