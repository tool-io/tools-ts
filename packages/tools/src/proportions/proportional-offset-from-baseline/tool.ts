import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseline: number;
  readonly relativeOffset: number;
};
export type Output = { readonly offset: number; readonly adjusted: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseline: { type: "number" },
    relativeOffset: { type: "number" },
  },
  required: ["baseline", "relativeOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offset: { type: "number" }, adjusted: { type: "number" } },
  required: ["offset", "adjusted"],
} as const;
/** Return both a signed proportional offset and the resulting baseline-plus-offset value. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseline, relativeOffset } = request;
  const compute = (): Output => {
    return {
      offset: baseline * relativeOffset,
      adjusted: baseline * (1 + relativeOffset),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseline: 80, relativeOffset: 0.25 },
  output: { offset: 20, adjusted: 100 },
} satisfies ToolExample<Input, Output>;
export const proportionalOffsetFromBaselineTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/proportional-offset-from-baseline",
    title: "Proportional Offset From Baseline Tool",
    description:
      "Return both a signed proportional offset and the resulting baseline-plus-offset value.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseline: { type: "number" },
        relativeOffset: { type: "number" },
      },
      required: ["baseline", "relativeOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { offset: { type: "number" }, adjusted: { type: "number" } },
      required: ["offset", "adjusted"],
    },
    ports: {
      inputs: [
        {
          id: "baseline",
          label: "Baseline",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "relativeOffset",
          label: "Relative Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "offset", label: "Offset", valueType: { type: "number" } },
        { id: "adjusted", label: "Adjusted", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = proportionalOffsetFromBaselineTool.execute;
export default proportionalOffsetFromBaselineTool;
