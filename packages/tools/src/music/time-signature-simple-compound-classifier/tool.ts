import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, sum, bounded, signature } from "../shared.js";
export type Input = Readonly<{
  readonly signatureNumerator: number;
  readonly signatureDenominator: number;
  readonly declaredBeatGroups: readonly number[];
}>;
export type Output = Readonly<{
  readonly beatDivisionClass: string;
  readonly notatedBeatCount: number;
  readonly uniformBeatGrouping: boolean;
}>;
const inputFields = [
  { id: "signatureNumerator", label: "Signature numerator", kind: "number" },
  {
    id: "signatureDenominator",
    label: "Signature denominator",
    kind: "number",
  },
  {
    id: "declaredBeatGroups",
    label: "Declared beat groups",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  signature(input.signatureNumerator, input.signatureDenominator);
  if (
    !input.declaredBeatGroups.length ||
    input.declaredBeatGroups.length > 32 ||
    sum(input.declaredBeatGroups) !== input.signatureNumerator
  )
    simpleError(
      "grouping",
      "Explicit grouping must sum to signature numerator.",
    );
  input.declaredBeatGroups.forEach((v) => bounded(v, "beatGroup", 1, 4));
  const same = input.declaredBeatGroups.every(
      (v) => v === input.declaredBeatGroups[0],
    ),
    label =
      same && input.declaredBeatGroups[0] === 3
        ? "compound"
        : same && [1, 2, 4].includes(input.declaredBeatGroups[0])
          ? "simple"
          : "mixed-additive";
  return {
    beatDivisionClass: label,
    notatedBeatCount: input.declaredBeatGroups.length,
    uniformBeatGrouping: same,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  signatureNumerator: 6,
  signatureDenominator: 8,
  declaredBeatGroups: [3, 3],
} satisfies Input;
export const exampleOutput = {
  beatDivisionClass: "compound",
  notatedBeatCount: 2,
  uniformBeatGrouping: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/time-signature-simple-compound-classifier",
  title: "Simple/Compound Time Signature Classifier",
  description:
    "Classify explicit notated beat groups rather than assume every divisible-by-three numerator is compound (3/4 may be three single quarter beats); mixed/additive grouping retained.",
  inputs: inputFields,
  outputs: [
    { id: "beatDivisionClass", label: "Beat division class", kind: "string" },
    { id: "notatedBeatCount", label: "Notated beat count", kind: "number" },
    {
      id: "uniformBeatGrouping",
      label: "Uniform beat grouping",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      signatureNumerator: value.signatureNumerator as number,
      signatureDenominator: value.signatureDenominator as number,
      declaredBeatGroups: value.declaredBeatGroups as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
