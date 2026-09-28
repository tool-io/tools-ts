import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly focalParameter: number };
export type Output = { readonly halfwidth: number; readonly fullWidth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { focalParameter: { type: "number" } },
  required: ["focalParameter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { halfwidth: { type: "number" }, fullWidth: { type: "number" } },
  required: ["halfwidth", "fullWidth"],
} as const;
/** For y²=4*p*x return the positive focal chord halfwidth and full latus rectum width. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { focalParameter } = input;
  const compute = (): Output => {
    H.domain(focalParameter !== 0);
    const halfwidth = 2 * Math.abs(focalParameter);
    return { halfwidth, fullWidth: 2 * halfwidth };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { focalParameter: 3 },
  output: { halfwidth: 6, fullWidth: 12 },
} satisfies ToolExample<Input, Output>;
export const parabolaLatusRectumHalfwidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/parabola-latus-rectum-halfwidth",
    title: "Parabola Latus Rectum Halfwidth Tool",
    description:
      "For y²=4*p*x return the positive focal chord halfwidth and full latus rectum width.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { focalParameter: { type: "number" } },
      required: ["focalParameter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        halfwidth: { type: "number" },
        fullWidth: { type: "number" },
      },
      required: ["halfwidth", "fullWidth"],
    },
    ports: {
      inputs: [
        {
          id: "focalParameter",
          label: "Focal Parameter",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "halfwidth", label: "Halfwidth", valueType: { type: "number" } },
        { id: "fullWidth", label: "Full Width", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = parabolaLatusRectumHalfwidthTool.execute;
export default parabolaLatusRectumHalfwidthTool;
