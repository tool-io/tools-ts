import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly ciphertextLength: number;
  readonly minimumColumns: number;
  readonly maximumColumns: number;
  readonly requireFullRectangle: boolean;
}>;
export type Output = Readonly<{
  readonly candidateColumnCounts: readonly number[];
  readonly candidateRowCounts: readonly number[];
}>;
const inputFields = [
  { id: "ciphertextLength", label: "Ciphertext length", kind: "number" },
  { id: "minimumColumns", label: "Minimum columns", kind: "number" },
  { id: "maximumColumns", label: "Maximum columns", kind: "number" },
  {
    id: "requireFullRectangle",
    label: "Require full rectangle",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.ciphertextLength, "length", 1, 4096);
  bounded(input.minimumColumns, "minimum", 1, 128);
  bounded(input.maximumColumns, "maximum", input.minimumColumns, 128);
  const columns = Array.from(
    { length: input.maximumColumns - input.minimumColumns + 1 },
    (_, i) => i + input.minimumColumns,
  ).filter(
    (c) =>
      c <= input.ciphertextLength &&
      (!input.requireFullRectangle || input.ciphertextLength % c === 0),
  );
  return {
    candidateColumnCounts: columns,
    candidateRowCounts: columns.map((c) =>
      Math.ceil(input.ciphertextLength / c),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  ciphertextLength: 12,
  minimumColumns: 2,
  maximumColumns: 5,
  requireFullRectangle: true,
} satisfies Input;
export const exampleOutput = {
  candidateColumnCounts: [2, 3, 4],
  candidateRowCounts: [6, 4, 3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/transposition-column-count-bruteforce-list",
  title: "Transposition Column-Count Candidate List",
  description:
    "Enumerate geometry-compatible column counts under explicit full/ragged rectangle policy, not decrypting/scoring candidates or recovered key length.",
  inputs: inputFields,
  outputs: [
    {
      id: "candidateColumnCounts",
      label: "Candidate column counts",
      kind: "numberList",
    },
    {
      id: "candidateRowCounts",
      label: "Candidate row counts",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      ciphertextLength: value.ciphertextLength as number,
      minimumColumns: value.minimumColumns as number,
      maximumColumns: value.maximumColumns as number,
      requireFullRectangle: value.requireFullRectangle as boolean,
    }),
});
export const run = tool.execute;
export default tool;
