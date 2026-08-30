import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly accession: string;
  readonly digitsRequired: number;
}>;
export type Output = Readonly<{
  readonly valid: boolean;
  readonly numericId: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    !Number.isSafeInteger(input.digitsRequired) ||
    input.digitsRequired < 1 ||
    input.digitsRequired > 15
  )
    simpleError(
      "digitsRequired",
      "Digit length must be a positive integer up to 15.",
    );
  const valid = new RegExp(`^HMDB[0-9]{${input.digitsRequired}}$`).test(
    input.accession,
  );
  return { valid, numericId: valid ? Number(input.accession.slice(4)) : 0 };
};
export const exampleInput = {
  accession: "HMDB0001234",
  digitsRequired: 7,
} satisfies Input;
export const exampleOutput = { valid: true, numericId: 1234 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/hmdb-accession-validator",
  title: "HMDB Accession Validator",
  description:
    "Validate an HMDB accession against a caller-specified numeric width.",
  inputs: [
    { id: "accession", kind: "string", label: "Accession" },
    { id: "digitsRequired", kind: "number", label: "Digits required" },
  ],
  outputs: [
    { id: "valid", kind: "boolean", label: "Valid" },
    { id: "numericId", kind: "number", label: "Numeric id" },
  ],
  calculate: (value) =>
    calculate({
      accession: value.accession as string,
      digitsRequired: value.digitsRequired as number,
    }),
});
export const run = tool.execute;
export default tool;
