import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  bytes,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly padByteValues: readonly number[];
  readonly callerMaximumAbsoluteMonobitZ: number;
}>;
export type Output = Readonly<{
  readonly observedOneBits: number;
  readonly observedZeroBits: number;
  readonly signedMonobitZ: number;
  readonly withinCallerMonobitZ: boolean;
}>;
const inputFields = [
  { id: "padByteValues", label: "Pad byte values", kind: "numberList" },
  {
    id: "callerMaximumAbsoluteMonobitZ",
    label: "Caller maximum absolute monobit z",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bytes(input.padByteValues);
  nonnegative(input.callerMaximumAbsoluteMonobitZ, "threshold");
  let ones = 0;
  for (const byte of input.padByteValues)
    for (let b = 0; b < 8; b++) ones += (byte >> b) & 1;
  const bits = input.padByteValues.length * 8,
    z = (2 * ones - bits) / Math.sqrt(bits);
  return {
    observedOneBits: ones,
    observedZeroBits: bits - ones,
    signedMonobitZ: z,
    withinCallerMonobitZ: Math.abs(z) <= input.callerMaximumAbsoluteMonobitZ,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  padByteValues: [0, 255],
  callerMaximumAbsoluteMonobitZ: 2,
} satisfies Input;
export const exampleOutput = {
  observedOneBits: 8,
  observedZeroBits: 8,
  signedMonobitZ: 0,
  withinCallerMonobitZ: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/pad-byte-randomness-monobit-checker",
  title: "Pad Byte Monobit Randomness Check",
  description:
    "Audit actual bit balance with caller Z threshold, no secure randomness/OTP pad certification and not a full randomness battery.",
  inputs: inputFields,
  outputs: [
    { id: "observedOneBits", label: "Observed one bits", kind: "number" },
    { id: "observedZeroBits", label: "Observed zero bits", kind: "number" },
    { id: "signedMonobitZ", label: "Signed monobit z", kind: "number" },
    {
      id: "withinCallerMonobitZ",
      label: "Within caller monobit z",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      padByteValues: value.padByteValues as readonly number[],
      callerMaximumAbsoluteMonobitZ:
        value.callerMaximumAbsoluteMonobitZ as number,
    }),
});
export const run = tool.execute;
export default tool;
