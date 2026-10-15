import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch53-shared.js";

export type Input = Readonly<{ dnaSequence: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "dnaSequence", label: "Dna sequence", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  const s = i.dnaSequence.toUpperCase();
  if (!/^[ACGT]+$(?![\s\S])/.test(s) || s.length % 2)
    simpleError("sequence", "Even-length canonical DNA.");
  const rc = [...s]
    .reverse()
    .map((c) => ({ A: "T", T: "A", C: "G", G: "C" })[c])
    .join("");
  return {
    reverseComplementPalindrome: s === rc,
    leftHalf: s.slice(0, s.length / 2),
    rightHalf: s.slice(s.length / 2),
    repressorBindingEstablished: false,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { dnaSequence: "GAATTC" },
  output: {
    result: {
      reverseComplementPalindrome: true,
      leftHalf: "GAA",
      rightHalf: "TTC",
      repressorBindingEstablished: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/operator-halfsite-palindrome-checker",
  title: "Operator Repressor Binding Motif Palindrome Half-Site Checker",
  description:
    "Check a full reverse-complement palindrome and report half-sites; sequence symmetry alone does not prove operator/repressor binding.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reverseComplementPalindrome: { type: "boolean" },
          leftHalf: { type: "string" },
          rightHalf: { type: "string" },
          repressorBindingEstablished: { type: "boolean" },
        },
        required: [
          "reverseComplementPalindrome",
          "leftHalf",
          "rightHalf",
          "repressorBindingEstablished",
        ],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
