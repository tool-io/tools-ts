import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly width: number;
  readonly crossfall: number;
  readonly positiveTowardRight: boolean;
};
export type Output = { readonly rightMinusLeft: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number", minimum: 0 },
    crossfall: { type: "number" },
    positiveTowardRight: { type: "boolean" },
  },
  required: ["width", "crossfall", "positiveTowardRight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rightMinusLeft: { type: "number" } },
  required: ["rightMinusLeft"],
} as const;
/** Signed linear height difference from supplied path width and rise/run crossfall. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { width, crossfall, positiveTowardRight } = request;
  const compute = (): Output => {
    H.domain(width >= 0);
    return {
      rightMinusLeft: width * crossfall * (positiveTowardRight ? 1 : -1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { width: 2, crossfall: 0.02, positiveTowardRight: true },
  output: { rightMinusLeft: 0.04 },
} satisfies ToolExample<Input, Output>;
export const pathCrossfallHeightDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/path-crossfall-height-difference",
    title: "Path Crossfall Height Difference Tool",
    description:
      "Signed linear height difference from supplied path width and rise/run crossfall.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number", minimum: 0 },
        crossfall: { type: "number" },
        positiveTowardRight: { type: "boolean" },
      },
      required: ["width", "crossfall", "positiveTowardRight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rightMinusLeft: { type: "number" } },
      required: ["rightMinusLeft"],
    },
    ports: {
      inputs: [
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "crossfall",
          label: "Crossfall",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveTowardRight",
          label: "Positive Toward Right",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "rightMinusLeft",
          label: "Right Minus Left",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pathCrossfallHeightDifferenceTool.execute;
export default pathCrossfallHeightDifferenceTool;
