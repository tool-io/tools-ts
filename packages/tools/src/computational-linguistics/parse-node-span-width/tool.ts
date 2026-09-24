import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startToken: number;
  readonly endToken: number;
  readonly inclusiveEnd: boolean;
};
export type Output = { readonly width: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startToken: { type: "integer", minimum: 0 },
    endToken: { type: "integer" },
    inclusiveEnd: { type: "boolean" },
  },
  required: ["startToken", "endToken", "inclusiveEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { width: { type: "integer" } },
  required: ["width"],
} as const;
/** Calculate parse node span width from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startToken, endToken, inclusiveEnd } = request;
  const compute = (): Output => {
    H.integer(startToken, 0);
    H.integer(endToken, startToken);
    return { width: endToken - startToken + (inclusiveEnd ? 1 : 0) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startToken: 2, endToken: 5, inclusiveEnd: false },
  output: { width: 3 },
} satisfies ToolExample<Input, Output>;
export const parseNodeSpanWidthTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "computational-linguistics/parse-node-span-width",
    title: "Parse Node Span Width Tool",
    description:
      "Calculate parse node span width from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startToken: { type: "integer", minimum: 0 },
        endToken: { type: "integer" },
        inclusiveEnd: { type: "boolean" },
      },
      required: ["startToken", "endToken", "inclusiveEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { width: { type: "integer" } },
      required: ["width"],
    },
    ports: {
      inputs: [
        {
          id: "startToken",
          label: "Start Token",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endToken",
          label: "End Token",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "inclusiveEnd",
          label: "Inclusive End",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "width", label: "Width", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = parseNodeSpanWidthTool.execute;
export default parseNodeSpanWidthTool;
