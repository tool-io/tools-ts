import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly independentlyScannedFeet: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyScannedFeet",
    label: "Independently scanned feet",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.independentlyScannedFeet.length !== 6 ||
    input.independentlyScannedFeet.some((v) => !["-uu", "--", "-x"].includes(v))
  )
    simpleError(
      "feet",
      "Exactly six explicit quantitative feet;-=long, u=short, x=anceps.",
    );
  const f = input.independentlyScannedFeet;
  return {
    matchesRestrictedHexameter:
      f.slice(0, 5).every((v) => v === "-uu" || v === "--") &&
      (f[5] === "-x" || f[5] === "--"),
    substitutedFifthFoot: f[4] === "--",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyScannedFeet: ["-uu", "--", "-uu", "--", "-uu", "-x"] },
  output: {
    result: { matchesRestrictedHexameter: true, substitutedFifthFoot: false },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/dactylic-hexameter-scansion-pattern-checker",
  title: "Dactylic Hexameter Scansion Pattern Checker",
  description:
    "Restricted independently annotated dactylic hexameter foot pattern, including spondaic fifth; no syllabification, caesura, elision or poetic quality judgement.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
