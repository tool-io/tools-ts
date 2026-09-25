import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly point: readonly number[];
  readonly center: readonly number[];
  readonly radius: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    point: { type: "array", maxItems: 256, items: { type: "number" } },
    center: { type: "array", maxItems: 256, items: { type: "number" } },
    radius: { type: "number", minimum: 0 },
  },
  required: ["point", "center", "radius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate point to sphere signed radial gap from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { point, center, radius } = input;
  const compute = (): Output => {
    H.sameLength(point, center);
    H.domain(point.length > 0 && radius >= 0);
    return {
      signedGap: Math.hypot(...point.map((x, i) => x - center[i])) - radius,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { point: [3, 4], center: [0, 0], radius: 2 },
  output: { signedGap: 3 },
} satisfies ToolExample<Input, Output>;
export const pointToSphereSignedRadialGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/point-to-sphere-signed-radial-gap",
    title: "Point To Sphere Signed Radial Gap Tool",
    description:
      "Calculate point to sphere signed radial gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        point: { type: "array", maxItems: 256, items: { type: "number" } },
        center: { type: "array", maxItems: 256, items: { type: "number" } },
        radius: { type: "number", minimum: 0 },
      },
      required: ["point", "center", "radius"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
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
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pointToSphereSignedRadialGapTool.execute;
export default pointToSphereSignedRadialGapTool;
