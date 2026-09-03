import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, digits } from "../batch36-shared.js";
export type Input = Readonly<{ readonly decimalDigits: string }>;
export type Output = Readonly<{
  readonly interimDigit: number;
  readonly validDammChecksum: boolean;
}>;
const inputFields = [
  { id: "decimalDigits", label: "Decimal digits", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  digits(input.decimalDigits);
  const table = [
    [0, 3, 1, 7, 5, 9, 8, 6, 4, 2],
    [7, 0, 9, 2, 1, 5, 4, 8, 6, 3],
    [4, 2, 0, 6, 8, 7, 1, 3, 5, 9],
    [1, 7, 5, 0, 9, 8, 3, 4, 2, 6],
    [6, 1, 2, 3, 0, 4, 5, 9, 7, 8],
    [3, 6, 7, 4, 2, 0, 9, 5, 8, 1],
    [5, 8, 6, 9, 7, 2, 0, 1, 3, 4],
    [8, 9, 4, 5, 3, 6, 2, 0, 1, 7],
    [9, 4, 3, 8, 6, 1, 7, 2, 0, 5],
    [2, 5, 8, 1, 4, 3, 6, 7, 9, 0],
  ];
  let interim = 0;
  for (const c of input.decimalDigits) interim = table[interim][Number(c)];
  return { interimDigit: interim, validDammChecksum: interim === 0 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { decimalDigits: "5724" } satisfies Input;
export const exampleOutput = {
  interimDigit: 0,
  validDammChecksum: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/damm-algorithm-validator",
  title: "Damm Algorithm Validator",
  description:
    "Validate full caller Damm decimal checksum using standard quasigroup, retain final interim digit; not identity, bank assignment or security.",
  inputs: inputFields,
  outputs: [
    { id: "interimDigit", label: "Interim digit", kind: "number" },
    { id: "validDammChecksum", label: "Valid damm checksum", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({ decimalDigits: value.decimalDigits as string }),
});
export const run = tool.execute;
export default tool;
