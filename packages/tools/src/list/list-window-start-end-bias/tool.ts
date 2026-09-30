import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly size: number;
  readonly anchor: number;
  readonly bias: string;
};
export type Output = { readonly start: number; readonly end: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer", minimum: 0 },
    size: { type: "integer", minimum: 0 },
    anchor: { type: "integer", minimum: 0 },
    bias: { type: "string", maxLength: 8192, enum: ["start", "end"] },
  },
  required: ["length", "size", "anchor", "bias"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { start: { type: "integer" }, end: { type: "integer" } },
  required: ["start", "end"],
} as const;
/** Clamp a fixed-size half-open list window to its length with explicit anchor-edge bias. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, size, anchor, bias } = request;
  const compute = (): Output => {
    H.integer(length, 0);
    H.integer(size, 0, length);
    H.integer(anchor, 0, length);
    H.domain(["start", "end"].includes(bias));
    return {
      start: Math.max(
        0,
        Math.min(length - size, bias === "start" ? anchor : anchor - size),
      ),
      end:
        Math.max(
          0,
          Math.min(length - size, bias === "start" ? anchor : anchor - size),
        ) + size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 10, size: 4, anchor: 9, bias: "start" },
  output: { start: 6, end: 10 },
} satisfies ToolExample<Input, Output>;
export const listWindowStartEndBiasTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-window-start-end-bias",
    title: "List Window Start End Bias Tool",
    description:
      "Clamp a fixed-size half-open list window to its length with explicit anchor-edge bias.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "integer", minimum: 0 },
        size: { type: "integer", minimum: 0 },
        anchor: { type: "integer", minimum: 0 },
        bias: { type: "string", maxLength: 8192, enum: ["start", "end"] },
      },
      required: ["length", "size", "anchor", "bias"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { start: { type: "integer" }, end: { type: "integer" } },
      required: ["start", "end"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "size",
          label: "Size",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "anchor",
          label: "Anchor",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "bias",
          label: "Bias",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "start", label: "Start", valueType: { type: "integer" } },
        { id: "end", label: "End", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = listWindowStartEndBiasTool.execute;
export default listWindowStartEndBiasTool;
