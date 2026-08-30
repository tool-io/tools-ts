import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  bounded,
  aliquot,
} from "../batch-shared.js";
export type Input = Readonly<{ readonly startingInteger: number }>;
export type Output = Readonly<{
  readonly firstThreeAliquotIterates: readonly number[];
  readonly isExactLengthThreeSociableCycle: boolean;
}>;
const inputFields = [
  { id: "startingInteger", label: "Starting integer", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const n = bounded(input.startingInteger, "startingInteger", 1, 1000000),
    a = aliquot(n);
  if (a < 1 || a > 1000000)
    simpleError(
      "orbit",
      "First iterate outside bounded positive aliquot domain.",
    );
  const b = aliquot(a);
  if (b < 1 || b > 1000000)
    simpleError(
      "orbit",
      "Second iterate outside bounded positive aliquot domain.",
    );
  const c = aliquot(b);
  return {
    firstThreeAliquotIterates: [a, b, c],
    isExactLengthThreeSociableCycle: c === n && new Set([n, a, b]).size === 3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { startingInteger: 6 } satisfies Input;
export const exampleOutput = {
  firstThreeAliquotIterates: [6, 6, 6],
  isExactLengthThreeSociableCycle: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/sociable-chain-length-3",
  title: "Sociable Chain Length 3 Checker",
  description:
    "Check exact three-cycle in proper-divisor sum iteration; fixed perfect numbers and amicable two-cycles are not mislabelled length-three sociable cycles; out-of-domain intermediate refused.",
  inputs: inputFields,
  outputs: [
    {
      id: "firstThreeAliquotIterates",
      label: "First three aliquot iterates",
      kind: "numberList",
    },
    {
      id: "isExactLengthThreeSociableCycle",
      label: "Is exact length three sociable cycle",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({ startingInteger: value.startingInteger as number }),
});
export const run = tool.execute;
export default tool;
