import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly inchikey: string;
}>;
export type Output = Readonly<{
  readonly valid: boolean;
  readonly connectivityBlock: string;
  readonly stereoBlock: string;
}>;
export const calculate = (input: Input): Output => {
  const valid = /^[A-Z]{14}-[A-Z]{10}-[A-Z]$/.test(input.inchikey);
  const parts = input.inchikey.split("-");
  return {
    valid,
    connectivityBlock: valid ? parts[0] : "",
    stereoBlock: valid ? parts[1] : "",
  };
};
export const exampleInput = {
  inchikey: "AAAAAAAAAAAAAA-BBBBBBBBBB-C",
} satisfies Input;
export const exampleOutput = {
  valid: true,
  connectivityBlock: "AAAAAAAAAAAAAA",
  stereoBlock: "BBBBBBBBBB",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/inchikey-format-validator",
  title: "Inchikey Format Validator",
  description: "Validate the syntactic InChIKey block lengths and separators.",
  inputs: [{ id: "inchikey", kind: "string", label: "Inchikey" }],
  outputs: [
    { id: "valid", kind: "boolean", label: "Valid" },
    { id: "connectivityBlock", kind: "string", label: "Connectivity block" },
    { id: "stereoBlock", kind: "string", label: "Stereo block" },
  ],
  calculate: (value) =>
    calculate({
      inchikey: value.inchikey as string,
    }),
});
export const run = tool.execute;
export default tool;
