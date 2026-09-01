import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  key,
  namePitch,
  stepSpell,
  keySignature,
} from "../shared.js";
export type Input = Readonly<{ readonly majorTonic: string }>;
export type Output = Readonly<{
  readonly relativeMinorTonic: string;
  readonly sharedSignatureAccidentalCount: number;
}>;
const inputFields = [
  { id: "majorTonic", label: "Major tonic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const t = key(input.majorTonic),
    sig = keySignature(t, "major"),
    relative = stepSpell(t, 5, 9);
  return {
    relativeMinorTonic: namePitch(relative),
    sharedSignatureAccidentalCount: sig,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { majorTonic: "Ab" } satisfies Input;
export const exampleOutput = {
  relativeMinorTonic: "F",
  sharedSignatureAccidentalCount: -4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/relative-minor-key-finder",
  title: "Relative Minor Key Finder",
  description:
    "Find properly spelled relative natural-minor tonic at major sixth and shared signature from conventional major key, retaining enharmonic spelling; no arbitrary pitch-class subtraction.",
  inputs: inputFields,
  outputs: [
    { id: "relativeMinorTonic", label: "Relative minor tonic", kind: "string" },
    {
      id: "sharedSignatureAccidentalCount",
      label: "Shared signature accidental count",
      kind: "number",
    },
  ],
  calculate: (value) => calculate({ majorTonic: value.majorTonic as string }),
});
export const run = tool.execute;
export default tool;
