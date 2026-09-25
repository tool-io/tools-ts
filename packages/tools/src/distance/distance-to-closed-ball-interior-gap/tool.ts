import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  sameLength,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly point: readonly number[];
  readonly center: readonly number[];
  readonly radius: number;
};
export type Output = { readonly distance: number; readonly inside: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    point: { type: "array", maxItems: 256, items: { type: "number" } },
    center: { type: "array", maxItems: 256, items: { type: "number" } },
    radius: { type: "number" },
  },
  required: ["point", "center", "radius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distance: { type: "number" }, inside: { type: "boolean" } },
  required: ["distance", "inside"],
} as const;
/** Compute distance to closed ball interior gap from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { point, center, radius } = input;
  const compute = (): Output => {
    sameLength(point, center);
    domain(radius >= 0 && point.length > 0);
    const gap = Math.hypot(...point.map((x, i) => x - center[i])) - radius;
    return { distance: Math.max(0, gap), inside: gap <= 0 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { point: [3, 4], center: [0, 0], radius: 2 },
  output: { distance: 3, inside: false },
} satisfies ToolExample<Input, Output>;
export const distanceToClosedBallInteriorGapTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "distance/distance-to-closed-ball-interior-gap",
  title: "Distance To Closed Ball Interior Gap Tool",
  description:
    "Compute distance to closed ball interior gap from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "point",
        label: "Point",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "center",
        label: "Center",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "radius",
        label: "Radius",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "distance", label: "Distance", valueType: { type: "number" } },
      { id: "inside", label: "Inside", valueType: { type: "boolean" } },
    ],
  },
});
export const run = distanceToClosedBallInteriorGapTool.execute;
export default distanceToClosedBallInteriorGapTool;
