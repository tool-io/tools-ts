import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly radialDistance: number;
  readonly innerRadius: number;
  readonly outerRadius: number;
};
export type Output = { readonly distance: number; readonly region: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radialDistance: { type: "number" },
    innerRadius: { type: "number" },
    outerRadius: { type: "number" },
  },
  required: ["radialDistance", "innerRadius", "outerRadius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number" },
    region: { type: "string", maxLength: 8192 },
  },
  required: ["distance", "region"],
} as const;
/** Compute point to annulus radial interval gap from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { radialDistance, innerRadius, outerRadius } = input;
  const compute = (): Output => {
    domain(
      radialDistance >= 0 && innerRadius >= 0 && outerRadius >= innerRadius,
    );
    return {
      distance:
        radialDistance < innerRadius
          ? innerRadius - radialDistance
          : radialDistance > outerRadius
            ? radialDistance - outerRadius
            : 0,
      region:
        radialDistance < innerRadius
          ? "hole"
          : radialDistance > outerRadius
            ? "outside"
            : "annulus",
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { radialDistance: 1, innerRadius: 2, outerRadius: 4 },
  output: { distance: 1, region: "hole" },
} satisfies ToolExample<Input, Output>;
export const pointToAnnulusRadialIntervalGapTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "distance/point-to-annulus-radial-interval-gap",
  title: "Point To Annulus Radial Interval Gap Tool",
  description:
    "Compute point to annulus radial interval gap from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "radialDistance",
        label: "Radial Distance",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "innerRadius",
        label: "Inner Radius",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "outerRadius",
        label: "Outer Radius",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "distance", label: "Distance", valueType: { type: "number" } },
      { id: "region", label: "Region", valueType: { type: "string" } },
    ],
  },
});
export const run = pointToAnnulusRadialIntervalGapTool.execute;
export default pointToAnnulusRadialIntervalGapTool;
