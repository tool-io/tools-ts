import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly line: string };
export type Output = {
  readonly negated: boolean;
  readonly literalLeadingBang: boolean;
  readonly pattern: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { line: { type: "string", maxLength: 8192 } },
  required: ["line"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    negated: { type: "boolean" },
    literalLeadingBang: { type: "boolean" },
    pattern: { type: "string", maxLength: 8192 },
  },
  required: ["negated", "literalLeadingBang", "pattern"],
} as const;
/** Calculate git ignore negation escape pair from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { line } = input;
  const compute = (): Output => {
    const literalLeadingBang = line.startsWith("\\!"),
      negated = line.startsWith("!");
    return {
      negated,
      literalLeadingBang,
      pattern: literalLeadingBang || negated ? line.slice(1) : line,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { line: "!file" },
  output: { negated: true, literalLeadingBang: false, pattern: "file" },
} satisfies ToolExample<Input, Output>;
export const gitIgnoreNegationEscapePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "development/git-ignore-negation-escape-pair",
    title: "Git Ignore Negation Escape Pair Tool",
    description:
      "Calculate git ignore negation escape pair from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { line: { type: "string", maxLength: 8192 } },
      required: ["line"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        negated: { type: "boolean" },
        literalLeadingBang: { type: "boolean" },
        pattern: { type: "string", maxLength: 8192 },
      },
      required: ["negated", "literalLeadingBang", "pattern"],
    },
    ports: {
      inputs: [
        {
          id: "line",
          label: "Line",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "negated", label: "Negated", valueType: { type: "boolean" } },
        {
          id: "literalLeadingBang",
          label: "Literal Leading Bang",
          valueType: { type: "boolean" },
        },
        { id: "pattern", label: "Pattern", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = gitIgnoreNegationEscapePairTool.execute;
export default gitIgnoreNegationEscapePairTool;
