import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly finDepth: number;
  readonly angleRadians: number;
};
export type Output = { readonly projectedDepth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    finDepth: { type: "number", minimum: 0 },
    angleRadians: { type: "number" },
  },
  required: ["finDepth", "angleRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { projectedDepth: { type: "number" } },
  required: ["projectedDepth"],
} as const;
/** Project a fin depth perpendicular to a supplied ray direction in a planar section, with angle in radians. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { finDepth, angleRadians } = request;
  const compute = (): Output => {
    H.domain(finDepth >= 0);
    return { projectedDepth: finDepth * Math.abs(Math.sin(angleRadians)) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { finDepth: 0.6, angleRadians: 1.5707963267948966 },
  output: { projectedDepth: 0.6 },
} satisfies ToolExample<Input, Output>;
export const facadeSolarFinProjectedDepthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/facade-solar-fin-projected-depth",
    title: "Facade Solar Fin Projected Depth Tool",
    description:
      "Project a fin depth perpendicular to a supplied ray direction in a planar section, with angle in radians.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        finDepth: { type: "number", minimum: 0 },
        angleRadians: { type: "number" },
      },
      required: ["finDepth", "angleRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { projectedDepth: { type: "number" } },
      required: ["projectedDepth"],
    },
    ports: {
      inputs: [
        {
          id: "finDepth",
          label: "Fin Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "angleRadians",
          label: "Angle Radians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "projectedDepth",
          label: "Projected Depth",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = facadeSolarFinProjectedDepthTool.execute;
export default facadeSolarFinProjectedDepthTool;
