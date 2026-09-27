import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly first: number; readonly second: number };
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "integer", minimum: 0 },
    second: { type: "integer", minimum: 1 },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Calculate ratio colon reduction display from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    H.integer(first, 0);
    H.integer(second, 1);
    let a = first,
      b = second;
    while (b) {
      const r = a % b;
      a = b;
      b = r;
    }
    return { text: first / a + ":" + second / a };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 12, second: 18 },
  output: { text: "2:3" },
} satisfies ToolExample<Input, Output>;
export const ratioColonReductionDisplayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/ratio-colon-reduction-display",
    title: "Ratio Colon Reduction Display Tool",
    description:
      "Calculate ratio colon reduction display from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "integer", minimum: 0 },
        second: { type: "integer", minimum: 1 },
      },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = ratioColonReductionDisplayTool.execute;
export default ratioColonReductionDisplayTool;
