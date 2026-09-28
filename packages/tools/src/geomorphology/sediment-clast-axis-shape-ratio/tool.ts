import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly longAxis: number;
  readonly intermediateAxis: number;
  readonly shortAxis: number;
};
export type Output = {
  readonly flatnessRatio: number;
  readonly elongationRatio: number;
  readonly sphericityProxy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    longAxis: { type: "number" },
    intermediateAxis: { type: "number" },
    shortAxis: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["longAxis", "intermediateAxis", "shortAxis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flatnessRatio: { type: "number" },
    elongationRatio: { type: "number" },
    sphericityProxy: { type: "number" },
  },
  required: ["flatnessRatio", "elongationRatio", "sphericityProxy"],
} as const;
/** Axis ratios and maximum-projection sphericity proxy [c^2/(ab)]^(1/3), with a>=b>=c. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { longAxis, intermediateAxis, shortAxis } = request;
  const compute = (): Output => {
    H.positive(shortAxis);
    H.domain(longAxis >= intermediateAxis && intermediateAxis >= shortAxis);
    return {
      flatnessRatio: shortAxis / intermediateAxis,
      elongationRatio: intermediateAxis / longAxis,
      sphericityProxy: Math.cbrt(
        shortAxis ** 2 / (longAxis * intermediateAxis),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { longAxis: 8, intermediateAxis: 4, shortAxis: 2 },
  output: { flatnessRatio: 0.5, elongationRatio: 0.5, sphericityProxy: 0.5 },
} satisfies ToolExample<Input, Output>;
export const sedimentClastAxisShapeRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/sediment-clast-axis-shape-ratio",
    title: "Sediment Clast Axis Shape Ratio Tool",
    description:
      "Axis ratios and maximum-projection sphericity proxy [c^2/(ab)]^(1/3), with a>=b>=c.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        longAxis: { type: "number" },
        intermediateAxis: { type: "number" },
        shortAxis: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["longAxis", "intermediateAxis", "shortAxis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flatnessRatio: { type: "number" },
        elongationRatio: { type: "number" },
        sphericityProxy: { type: "number" },
      },
      required: ["flatnessRatio", "elongationRatio", "sphericityProxy"],
    },
    ports: {
      inputs: [
        {
          id: "longAxis",
          label: "Long Axis",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "intermediateAxis",
          label: "Intermediate Axis",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shortAxis",
          label: "Short Axis",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "flatnessRatio",
          label: "Flatness Ratio",
          valueType: { type: "number" },
        },
        {
          id: "elongationRatio",
          label: "Elongation Ratio",
          valueType: { type: "number" },
        },
        {
          id: "sphericityProxy",
          label: "Sphericity Proxy",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sedimentClastAxisShapeRatioTool.execute;
export default sedimentClastAxisShapeRatioTool;
