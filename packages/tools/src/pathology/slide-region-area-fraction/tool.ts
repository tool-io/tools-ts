import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly regionArea: number; readonly slideArea: number };
export type Output = { readonly fraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    regionArea: { type: "number", minimum: 0 },
    slideArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["regionArea", "slideArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" } },
  required: ["fraction"],
} as const;
/** Compute a supplied research annotation area fraction without diagnostic classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { regionArea, slideArea } = request;
  const compute = (): Output => {
    H.positive(slideArea);
    H.domain(regionArea >= 0 && regionArea <= slideArea);
    return { fraction: regionArea / slideArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { regionArea: 2, slideArea: 10 },
  output: { fraction: 0.2 },
} satisfies ToolExample<Input, Output>;
export const slideRegionAreaFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pathology/slide-region-area-fraction",
    title: "Slide Region Area Fraction Tool",
    description:
      "Compute a supplied research annotation area fraction without diagnostic classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        regionArea: { type: "number", minimum: 0 },
        slideArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["regionArea", "slideArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { fraction: { type: "number" } },
      required: ["fraction"],
    },
    ports: {
      inputs: [
        {
          id: "regionArea",
          label: "Region Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "slideArea",
          label: "Slide Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = slideRegionAreaFractionTool.execute;
export default slideRegionAreaFractionTool;
