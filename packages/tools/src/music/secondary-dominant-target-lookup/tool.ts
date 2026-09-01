import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  key,
  namePitch,
  stepSpell,
  roman,
  romanRoot,
} from "../shared.js";
export type Input = Readonly<{
  readonly majorTonic: string;
  readonly secondaryFunction: string;
}>;
export type Output = Readonly<{
  readonly targetRomanToken: string;
  readonly targetChordRoot: string;
  readonly secondaryDominantRoot: string;
  readonly secondaryDominantSymbol: string;
}>;
const inputFields = [
  { id: "majorTonic", label: "Major tonic", kind: "string" },
  { id: "secondaryFunction", label: "Secondary function", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const m =
    /^V(7)?\/((?:bb|b|##|#)?(?:VII|VI|IV|V|III|II|I|vii|vi|iv|v|iii|ii|i)(?:o)?)$/.exec(
      input.secondaryFunction,
    );
  if (!m)
    return simpleError(
      "function",
      "Explicit V or V7 over a simple Roman target required.",
    );
  const target = romanRoot(key(input.majorTonic), m[2]),
    r = roman(m[2]);
  if (r.quality === "dim")
    simpleError(
      "target",
      "Diminished tonicization targets unsupported by this model.",
    );
  const dom = stepSpell(target, 4, 7);
  return {
    targetRomanToken: m[2],
    targetChordRoot: namePitch(target),
    secondaryDominantRoot: namePitch(dom),
    secondaryDominantSymbol: namePitch(dom) + (m[1] ? "7" : ""),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  majorTonic: "C",
  secondaryFunction: "V7/ii",
} satisfies Input;
export const exampleOutput = {
  targetRomanToken: "ii",
  targetChordRoot: "D",
  secondaryDominantRoot: "A",
  secondaryDominantSymbol: "A7",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/secondary-dominant-target-lookup",
  title: "Secondary Dominant Target Lookup",
  description:
    "Parse secondary V/V7 function over explicit major-key Roman target and derive spelled target/dominant root; nested functions/diminished targets rejected, no inferred resolution from chord alone.",
  inputs: inputFields,
  outputs: [
    { id: "targetRomanToken", label: "Target roman token", kind: "string" },
    { id: "targetChordRoot", label: "Target chord root", kind: "string" },
    {
      id: "secondaryDominantRoot",
      label: "Secondary dominant root",
      kind: "string",
    },
    {
      id: "secondaryDominantSymbol",
      label: "Secondary dominant symbol",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      majorTonic: value.majorTonic as string,
      secondaryFunction: value.secondaryFunction as string,
    }),
});
export const run = tool.execute;
export default tool;
