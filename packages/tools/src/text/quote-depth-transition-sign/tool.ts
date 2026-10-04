import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly before: number; readonly after: number };
export type Output = { readonly delta: number; readonly direction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    before: { type: "integer", minimum: 0 },
    after: { type: "integer", minimum: 0 },
  },
  required: ["before", "after"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { delta: { type: "integer" }, direction: { type: "integer" } },
  required: ["delta", "direction"],
} as const;
/** Calculate quote depth transition sign from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { before, after } = request;
  const compute = (): Output => {
    H.integer(before, 0);
    H.integer(after, 0);
    return { delta: after - before, direction: Math.sign(after - before) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { before: 1, after: 3 },
  output: { delta: 2, direction: 1 },
} satisfies ToolExample<Input, Output>;
export const quoteDepthTransitionSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/quote-depth-transition-sign",
    title: "Quote Depth Transition Sign Tool",
    description:
      "Calculate quote depth transition sign from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        before: { type: "integer", minimum: 0 },
        after: { type: "integer", minimum: 0 },
      },
      required: ["before", "after"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        delta: { type: "integer" },
        direction: { type: "integer" },
      },
      required: ["delta", "direction"],
    },
    ports: {
      inputs: [
        {
          id: "before",
          label: "Before",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "after",
          label: "After",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "delta", label: "Delta", valueType: { type: "integer" } },
        { id: "direction", label: "Direction", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = quoteDepthTransitionSignTool.execute;
export default quoteDepthTransitionSignTool;
