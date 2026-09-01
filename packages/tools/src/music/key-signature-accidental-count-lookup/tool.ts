import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, key, keySignature } from "../shared.js";
export type Input = Readonly<{ readonly tonic: string; readonly mode: string }>;
export type Output = Readonly<{
  readonly signedSignatureAccidentalCount: number;
  readonly signatureKind: string;
  readonly orderedSignatureAccidentals: readonly string[];
}>;
const inputFields = [
  { id: "tonic", label: "Tonic", kind: "string" },
  { id: "mode", label: "Mode", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const n = keySignature(key(input.tonic), input.mode);
  return {
    signedSignatureAccidentalCount: n,
    signatureKind: n > 0 ? "sharp" : n < 0 ? "flat" : "none",
    orderedSignatureAccidentals: (n > 0
      ? ["F#", "C#", "G#", "D#", "A#", "E#", "B#"]
      : ["Bb", "Eb", "Ab", "Db", "Gb", "Cb", "Fb"]
    ).slice(0, Math.abs(n)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { tonic: "F#", mode: "major" } satisfies Input;
export const exampleOutput = {
  signedSignatureAccidentalCount: 6,
  signatureKind: "sharp",
  orderedSignatureAccidentals: ["F#", "C#", "G#", "D#", "A#", "E#"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/key-signature-accidental-count-lookup",
  title: "Key Signature Accidental Count Lookup",
  description:
    "Resolve conventionally spelled major/natural-minor key signatures and ordered actual accidentals, distinguishing enharmonic keys and rejecting signatures beyond seven; not circle-of-fifths pitch-class position.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedSignatureAccidentalCount",
      label: "Signed signature accidental count",
      kind: "number",
    },
    { id: "signatureKind", label: "Signature kind", kind: "string" },
    {
      id: "orderedSignatureAccidentals",
      label: "Ordered signature accidentals",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({ tonic: value.tonic as string, mode: value.mode as string }),
});
export const run = tool.execute;
export default tool;
