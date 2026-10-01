import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly first: number; readonly second: number };
export type Output = { readonly gap: number; readonly absoluteGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { first: { type: "number" }, second: { type: "number" } },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" }, absoluteGap: { type: "number" } },
  required: ["gap", "absoluteGap"],
} as const;
/** Compare supplied repeat research measurements without clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    return { gap: second - first, absoluteGap: Math.abs(second - first) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 10, second: 12 },
  output: { gap: 2, absoluteGap: 2 },
} satisfies ToolExample<Input, Output>;
export const landmarkMeasurementRepeatGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "osteopathy/landmark-measurement-repeat-gap",
    title: "Landmark Measurement Repeat Gap Tool",
    description:
      "Compare supplied repeat research measurements without clinical interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { first: { type: "number" }, second: { type: "number" } },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" }, absoluteGap: { type: "number" } },
      required: ["gap", "absoluteGap"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        {
          id: "absoluteGap",
          label: "Absolute Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = landmarkMeasurementRepeatGapTool.execute;
export default landmarkMeasurementRepeatGapTool;
