import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, digits } from "../batch36-shared.js";
export type Input = Readonly<{ readonly decimalDigits: string }>;
export type Output = Readonly<{
  readonly interimDigit: number;
  readonly validVerhoeffChecksum: boolean;
}>;
const inputFields = [
  { id: "decimalDigits", label: "Decimal digits", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  digits(input.decimalDigits);
  const d = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
      [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
      [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
      [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
      [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
      [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
      [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
      [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
      [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    ],
    p = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
      [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
      [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
      [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
      [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
      [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
      [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
    ];
  let interim = 0;
  [...input.decimalDigits].reverse().forEach((c, i) => {
    interim = d[interim][p[i % 8][Number(c)]];
  });
  return { interimDigit: interim, validVerhoeffChecksum: interim === 0 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { decimalDigits: "2363" } satisfies Input;
export const exampleOutput = {
  interimDigit: 0,
  validVerhoeffChecksum: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/verhoeff-algorithm-validator",
  title: "Verhoeff Algorithm Validator",
  description:
    "Validate full Verhoeff checksum with right-to-left standard dihedral/permutation convention, not Damm or Luhn and not authenticity.",
  inputs: inputFields,
  outputs: [
    { id: "interimDigit", label: "Interim digit", kind: "number" },
    {
      id: "validVerhoeffChecksum",
      label: "Valid verhoeff checksum",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({ decimalDigits: value.decimalDigits as string }),
});
export const run = tool.execute;
export default tool;
