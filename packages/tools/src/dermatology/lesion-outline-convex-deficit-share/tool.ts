import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outlineArea: number;
  readonly convexHullArea: number;
};
export type Output = { readonly deficit: number; readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outlineArea: { type: "number", minimum: 0 },
    convexHullArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["outlineArea", "convexHullArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { deficit: { type: "number" }, share: { type: "number" } },
  required: ["deficit", "share"],
} as const;
/** Compare supplied research annotation areas; not a clinical lesion score. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outlineArea, convexHullArea } = request;
  const compute = (): Output => {
    H.positive(convexHullArea);
    H.domain(outlineArea >= 0 && outlineArea <= convexHullArea);
    return {
      deficit: convexHullArea - outlineArea,
      share: (convexHullArea - outlineArea) / convexHullArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outlineArea: 8, convexHullArea: 10 },
  output: { deficit: 2, share: 0.2 },
} satisfies ToolExample<Input, Output>;
export const lesionOutlineConvexDeficitShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dermatology/lesion-outline-convex-deficit-share",
    title: "Lesion Outline Convex Deficit Share Tool",
    description:
      "Compare supplied research annotation areas; not a clinical lesion score.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outlineArea: { type: "number", minimum: 0 },
        convexHullArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["outlineArea", "convexHullArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { deficit: { type: "number" }, share: { type: "number" } },
      required: ["deficit", "share"],
    },
    ports: {
      inputs: [
        {
          id: "outlineArea",
          label: "Outline Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "convexHullArea",
          label: "Convex Hull Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "deficit", label: "Deficit", valueType: { type: "number" } },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = lesionOutlineConvexDeficitShareTool.execute;
export default lesionOutlineConvexDeficitShareTool;
