import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstBinMass: number;
  readonly secondBinMass: number;
};
export type Output = { readonly intersectionMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstBinMass: { type: "number", minimum: 0 },
    secondBinMass: { type: "number", minimum: 0 },
  },
  required: ["firstBinMass", "secondBinMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { intersectionMass: { type: "number" } },
  required: ["intersectionMass"],
} as const;
/** Return one nonnegative histogram bin's contribution to the histogram intersection. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstBinMass, secondBinMass } = request;
  const compute = (): Output => {
    H.domain(firstBinMass >= 0 && secondBinMass >= 0, "firstBinMass");
    return { intersectionMass: Math.min(firstBinMass, secondBinMass) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstBinMass: 0.3, secondBinMass: 0.2 },
  output: { intersectionMass: 0.2 },
} satisfies ToolExample<Input, Output>;
export const histogramBinIntersectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/histogram-bin-intersection",
    title: "Histogram Bin Intersection Tool",
    description:
      "Return one nonnegative histogram bin's contribution to the histogram intersection.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstBinMass: { type: "number", minimum: 0 },
        secondBinMass: { type: "number", minimum: 0 },
      },
      required: ["firstBinMass", "secondBinMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { intersectionMass: { type: "number" } },
      required: ["intersectionMass"],
    },
    ports: {
      inputs: [
        {
          id: "firstBinMass",
          label: "First Bin Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondBinMass",
          label: "Second Bin Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "intersectionMass",
          label: "Intersection Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = histogramBinIntersectionTool.execute;
export default histogramBinIntersectionTool;
