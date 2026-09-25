import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly opening: string };
export type Output = { readonly equals: number; readonly closing: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { opening: { type: "string", maxLength: 8192 } },
  required: ["opening"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equals: { type: "integer" },
    closing: { type: "string", maxLength: 8192 },
  },
  required: ["equals", "closing"],
} as const;
/** Calculate cmake bracket argument delimiter count from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { opening } = input;
  const compute = (): Output => {
    H.domain(/^\[=*\[(?![\s\S])/.test(opening));
    const equals = opening.length - 2;
    return { equals, closing: "]" + "=".repeat(equals) + "]" };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { opening: "[==[" },
  output: { equals: 2, closing: "]==]" },
} satisfies ToolExample<Input, Output>;
export const cmakeBracketArgumentDelimiterCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "development/cmake-bracket-argument-delimiter-count",
    title: "Cmake Bracket Argument Delimiter Count Tool",
    description:
      "Calculate cmake bracket argument delimiter count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { opening: { type: "string", maxLength: 8192 } },
      required: ["opening"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        equals: { type: "integer" },
        closing: { type: "string", maxLength: 8192 },
      },
      required: ["equals", "closing"],
    },
    ports: {
      inputs: [
        {
          id: "opening",
          label: "Opening",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "equals", label: "Equals", valueType: { type: "integer" } },
        { id: "closing", label: "Closing", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = cmakeBracketArgumentDelimiterCountTool.execute;
export default cmakeBracketArgumentDelimiterCountTool;
