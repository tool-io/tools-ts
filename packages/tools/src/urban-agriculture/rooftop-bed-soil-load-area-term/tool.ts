import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly area: number;
  readonly depth: number;
  readonly wetDensity: number;
  readonly containerMass: number;
};
export type Output = { readonly mass: number; readonly massPerArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number", exclusiveMinimum: 0 },
    depth: { type: "number", minimum: 0 },
    wetDensity: { type: "number", minimum: 0 },
    containerMass: { type: "number", minimum: 0 },
  },
  required: ["area", "depth", "wetDensity", "containerMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { mass: { type: "number" }, massPerArea: { type: "number" } },
  required: ["mass", "massPerArea"],
} as const;
/** Actual supplied planter mass accounting without a structural load rating. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { area, depth, wetDensity, containerMass } = request;
  const compute = (): Output => {
    H.positive(area);
    H.domain(depth >= 0 && wetDensity >= 0 && containerMass >= 0);
    return {
      mass: area * depth * wetDensity + containerMass,
      massPerArea: depth * wetDensity + containerMass / area,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { area: 10, depth: 0.2, wetDensity: 1000, containerMass: 100 },
  output: { mass: 2100, massPerArea: 210 },
} satisfies ToolExample<Input, Output>;
export const rooftopBedSoilLoadAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-agriculture/rooftop-bed-soil-load-area-term",
    title: "Rooftop BED Soil Load Area Term Tool",
    description:
      "Actual supplied planter mass accounting without a structural load rating.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        area: { type: "number", exclusiveMinimum: 0 },
        depth: { type: "number", minimum: 0 },
        wetDensity: { type: "number", minimum: 0 },
        containerMass: { type: "number", minimum: 0 },
      },
      required: ["area", "depth", "wetDensity", "containerMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { mass: { type: "number" }, massPerArea: { type: "number" } },
      required: ["mass", "massPerArea"],
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
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wetDensity",
          label: "Wet Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "containerMass",
          label: "Container Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "mass", label: "Mass", valueType: { type: "number" } },
        {
          id: "massPerArea",
          label: "Mass Per Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rooftopBedSoilLoadAreaTermTool.execute;
export default rooftopBedSoilLoadAreaTermTool;
