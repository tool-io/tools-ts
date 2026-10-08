import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly lowerEdge: number; readonly upperEdge: number };
export type Output = { readonly midpoint: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lowerEdge: { type: "number" }, upperEdge: { type: "number" } },
  required: ["lowerEdge", "upperEdge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { midpoint: { type: "number" } },
  required: ["midpoint"],
} as const;
/** Return the midpoint of two supplied ordered finite quantization-bin edges without learning bin boundaries. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lowerEdge, upperEdge } = request;
  const compute = (): Output => {
    H.domain(upperEdge >= lowerEdge, "upperEdge");
    return { midpoint: lowerEdge / 2 + upperEdge / 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lowerEdge: 2, upperEdge: 6 },
  output: { midpoint: 4 },
} satisfies ToolExample<Input, Output>;
export const featureQuantizationSingleBinMidpointTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "data-science/feature-quantization-single-bin-midpoint",
      title: "Feature Quantization Single Bin Midpoint Tool",
      description:
        "Return the midpoint of two supplied ordered finite quantization-bin edges without learning bin boundaries.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lowerEdge: { type: "number" },
          upperEdge: { type: "number" },
        },
        required: ["lowerEdge", "upperEdge"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { midpoint: { type: "number" } },
        required: ["midpoint"],
      },
      ports: {
        inputs: [
          {
            id: "lowerEdge",
            label: "Lower Edge",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "upperEdge",
            label: "Upper Edge",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "midpoint", label: "Midpoint", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = featureQuantizationSingleBinMidpointTool.execute;
export default featureQuantizationSingleBinMidpointTool;
