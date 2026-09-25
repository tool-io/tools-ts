import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly pathspec: string };
export type Output = {
  readonly magic: readonly string[];
  readonly pattern: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pathspec: { type: "string", maxLength: 8192 } },
  required: ["pathspec"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    magic: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    pattern: { type: "string", maxLength: 8192 },
  },
  required: ["magic", "pattern"],
} as const;
/** Calculate git pathspec magic prefix token from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { pathspec } = input;
  const compute = (): Output => {
    const r = /^:\(([^)]*)\)([\s\S]*)(?![\s\S])/.exec(pathspec);
    H.domain(r !== null);
    return { magic: r[1] ? r[1].split(",") : [], pattern: r[2] };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { pathspec: ":(top,literal)a*b" },
  output: { magic: ["top", "literal"], pattern: "a*b" },
} satisfies ToolExample<Input, Output>;
export const gitPathspecMagicPrefixTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "development/git-pathspec-magic-prefix-token",
    title: "Git Pathspec Magic Prefix Token Tool",
    description:
      "Calculate git pathspec magic prefix token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { pathspec: { type: "string", maxLength: 8192 } },
      required: ["pathspec"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        magic: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        pattern: { type: "string", maxLength: 8192 },
      },
      required: ["magic", "pattern"],
    },
    ports: {
      inputs: [
        {
          id: "pathspec",
          label: "Pathspec",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "magic",
          label: "Magic",
          valueType: { type: "list", items: { type: "string" } },
        },
        { id: "pattern", label: "Pattern", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = gitPathspecMagicPrefixTokenTool.execute;
export default gitPathspecMagicPrefixTokenTool;
