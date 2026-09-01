import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  key,
  namePitch,
  keySignature,
} from "../shared.js";
export type Input = Readonly<{
  readonly tonic: string;
  readonly sourceMode: string;
}>;
export type Output = Readonly<{
  readonly parallelKeyLabel: string;
  readonly sourceSignatureAccidentalCount: number;
  readonly parallelSignatureAccidentalCount: number;
  readonly signedSignatureChange: number;
}>;
const inputFields = [
  { id: "tonic", label: "Tonic", kind: "string" },
  { id: "sourceMode", label: "Source mode", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const t = key(input.tonic),
    src = keySignature(t, input.sourceMode),
    mode = input.sourceMode === "major" ? "minor" : "major",
    dst = keySignature(t, mode);
  return {
    parallelKeyLabel: `${namePitch(t)} ${mode}`,
    sourceSignatureAccidentalCount: src,
    parallelSignatureAccidentalCount: dst,
    signedSignatureChange: dst - src,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { tonic: "C", sourceMode: "major" } satisfies Input;
export const exampleOutput = {
  parallelKeyLabel: "C minor",
  sourceSignatureAccidentalCount: 0,
  parallelSignatureAccidentalCount: -3,
  signedSignatureChange: -3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/parallel-key-lookup",
  title: "Parallel Key Lookup",
  description:
    "Resolve parallel major/natural-minor key with unchanged tonic spelling and both conventional signatures, preserving signed accidental change; not relative-key rotation.",
  inputs: inputFields,
  outputs: [
    { id: "parallelKeyLabel", label: "Parallel key label", kind: "string" },
    {
      id: "sourceSignatureAccidentalCount",
      label: "Source signature accidental count",
      kind: "number",
    },
    {
      id: "parallelSignatureAccidentalCount",
      label: "Parallel signature accidental count",
      kind: "number",
    },
    {
      id: "signedSignatureChange",
      label: "Signed signature change",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      tonic: value.tonic as string,
      sourceMode: value.sourceMode as string,
    }),
});
export const run = tool.execute;
export default tool;
