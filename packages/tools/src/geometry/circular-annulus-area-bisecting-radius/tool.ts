import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly inner: number; readonly outer: number };
export type Output = { readonly radius: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inner: { type: "number", minimum: 0 },
    outer: { type: "number" },
  },
  required: ["inner", "outer"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { radius: { type: "number" } },
  required: ["radius"],
} as const;
/** Calculate circular annulus area bisecting radius from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { inner, outer } = input;
  const compute = (): Output => {
    H.domain(inner >= 0 && outer > inner);
    return { radius: Math.hypot(inner, outer) / Math.SQRT2 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { inner: 0, outer: 4 },
  output: { radius: 2.82842712474619 },
} satisfies ToolExample<Input, Output>;
export const circularAnnulusAreaBisectingRadiusTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/circular-annulus-area-bisecting-radius",
    title: "Circular Annulus Area Bisecting Radius Tool",
    description:
      "Calculate circular annulus area bisecting radius from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inner: { type: "number", minimum: 0 },
        outer: { type: "number" },
      },
      required: ["inner", "outer"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { radius: { type: "number" } },
      required: ["radius"],
    },
    ports: {
      inputs: [
        {
          id: "inner",
          label: "Inner",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outer",
          label: "Outer",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "radius", label: "Radius", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = circularAnnulusAreaBisectingRadiusTool.execute;
export default circularAnnulusAreaBisectingRadiusTool;
