import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  unique,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly targetInitials: string;
  readonly callerReviewedWordBank: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "targetInitials", label: "Target initials", kind: "string" },
  {
    id: "callerReviewedWordBank",
    label: "Caller reviewed word bank",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  if (!/^[A-Z]{1,64}$/.test(input.targetInitials))
    simpleError(
      "target",
      "Explicit uppercaseASCIIinitials, not word-initial phonology inference.",
    );
  unique(input.callerReviewedWordBank, "wordbank");
  if (input.callerReviewedWordBank.some((v) => !v.trim()))
    simpleError("words", "Nonempty independently reviewed words.");
  const pools = Array.from(input.targetInitials, (c) =>
    input.callerReviewedWordBank.filter((v) => v[0].toUpperCase() === c),
  );
  if (pools.some((v) => !v.length))
    simpleError(
      "initial",
      "Every target initial needs an independently reviewed candidate.",
    );
  return {
    mnemonicWords: pools.map((v) => v[0]),
    candidateCountsByInitial: pools.map((v) => v.length),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    targetInitials: "CAT",
    callerReviewedWordBank: ["calm", "art", "trees", "cow"],
  },
  output: {
    result: {
      mnemonicWords: ["calm", "art", "trees"],
      candidateCountsByInitial: [2, 1, 1],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/acronym-mnemonic-generator",
  title: "Acronym Mnemonic Generator",
  description:
    "Choose first caller-order reviewed word per target initial, retaining candidate multiplicities; repetition allowed for repeated initials. Not an unconstrained language generator or memory-efficacy proof.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mnemonicWords: { type: "array", items: { type: "string" } },
          candidateCountsByInitial: {
            type: "array",
            items: { type: "number" },
          },
        },
        required: ["mnemonicWords", "candidateCountsByInitial"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
