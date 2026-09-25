import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly token: string };
export type Output = {
  readonly revision: string;
  readonly parent: number;
  readonly generation: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    revision: { type: "string", maxLength: 8192 },
    parent: { type: "integer" },
    generation: { type: "integer" },
  },
  required: ["revision", "parent", "generation"],
} as const;
/** Compute git revision parent suffix count from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    const m = /^([^\s~^]+)([~^])(\d{0,8})(?![\s\S])/.exec(token);
    domain(m);
    const n = m[3] === "" ? 1 : Number(m[3]);
    return {
      revision: m[1],
      parent: m[2] === "^" ? n : 1,
      generation: m[2] === "~" ? n : n === 0 ? 0 : 1,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "HEAD~3" },
  output: { revision: "HEAD", parent: 1, generation: 3 },
} satisfies ToolExample<Input, Output>;
export const gitRevisionParentSuffixCountTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "development/git-revision-parent-suffix-count",
  title: "Git Revision Parent Suffix Count Tool",
  description:
    "Compute git revision parent suffix count from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "token",
        label: "Token",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "revision", label: "Revision", valueType: { type: "string" } },
      { id: "parent", label: "Parent", valueType: { type: "integer" } },
      { id: "generation", label: "Generation", valueType: { type: "integer" } },
    ],
  },
});
export const run = gitRevisionParentSuffixCountTool.execute;
export default gitRevisionParentSuffixCountTool;
