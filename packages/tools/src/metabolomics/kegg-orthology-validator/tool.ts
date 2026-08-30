import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly orthologyId: string;
}>;
export type Output = Readonly<{
  readonly valid: boolean;
  readonly orthologyNumber: number;
}>;
export const calculate = (input: Input): Output => {
  const valid = /^K[0-9]{5}$/.test(input.orthologyId);
  return {
    valid,
    orthologyNumber: valid ? Number(input.orthologyId.slice(1)) : 0,
  };
};
export const exampleInput = { orthologyId: "K01234" } satisfies Input;
export const exampleOutput = {
  valid: true,
  orthologyNumber: 1234,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/kegg-orthology-validator",
  title: "KEGG Orthology Validator",
  description: "Parse and validate KEGG orthology identifiers.",
  inputs: [{ id: "orthologyId", kind: "string", label: "Orthology id" }],
  outputs: [
    { id: "valid", kind: "boolean", label: "Valid" },
    { id: "orthologyNumber", kind: "number", label: "Orthology number" },
  ],
  calculate: (value) =>
    calculate({
      orthologyId: value.orthologyId as string,
    }),
});
export const run = tool.execute;
export default tool;
