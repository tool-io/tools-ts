import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly perimeter: number; readonly area: number };
export type Output = { readonly edgeDensity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    perimeter: { type: "number", minimum: 0 },
    area: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["perimeter", "area"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { edgeDensity: { type: "number" } },
  required: ["edgeDensity"],
} as const;
/** Calculate habitat patch edge density from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { perimeter, area } = request;
  const compute = (): Output => {
    H.domain(perimeter >= 0);
    H.positive(area);
    return { edgeDensity: perimeter / area };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { perimeter: 24, area: 20 },
  output: { edgeDensity: 1.2 },
} satisfies ToolExample<Input, Output>;
export const habitatPatchEdgeDensityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "conservation-biology/habitat-patch-edge-density",
    title: "Habitat Patch Edge Density Tool",
    description:
      "Calculate habitat patch edge density from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        perimeter: { type: "number", minimum: 0 },
        area: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["perimeter", "area"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { edgeDensity: { type: "number" } },
      required: ["edgeDensity"],
    },
    ports: {
      inputs: [
        {
          id: "perimeter",
          label: "Perimeter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "edgeDensity",
          label: "Edge Density",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = habitatPatchEdgeDensityTool.execute;
export default habitatPatchEdgeDensityTool;
