import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly slope: number; readonly curvature: number };
export type Output = { readonly newtonOffset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { slope: { type: "number" }, curvature: { type: "number" } },
  required: ["slope", "curvature"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { newtonOffset: { type: "number" } },
  required: ["newtonOffset"],
} as const;
/** Return the local Newton displacement for finding a stationary point from supplied first/second derivatives. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { slope, curvature } = request;
  const compute = (): Output => {
    H.domain(curvature !== 0);
    return { newtonOffset: -slope / curvature };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { slope: 2, curvature: 4 },
  output: { newtonOffset: -0.5 },
} satisfies ToolExample<Input, Output>;
export const stationarySlopeCurvatureRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/stationary-slope-curvature-ratio",
    title: "Stationary Slope Curvature Ratio Tool",
    description:
      "Return the local Newton displacement for finding a stationary point from supplied first/second derivatives.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { slope: { type: "number" }, curvature: { type: "number" } },
      required: ["slope", "curvature"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { newtonOffset: { type: "number" } },
      required: ["newtonOffset"],
    },
    ports: {
      inputs: [
        {
          id: "slope",
          label: "Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "curvature",
          label: "Curvature",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "newtonOffset",
          label: "Newton Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = stationarySlopeCurvatureRatioTool.execute;
export default stationarySlopeCurvatureRatioTool;
