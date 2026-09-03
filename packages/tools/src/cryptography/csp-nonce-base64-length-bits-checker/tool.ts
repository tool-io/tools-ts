import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly nonceBase64: string;
  readonly callerMinimumDecodedBits: number;
}>;
export type Output = Readonly<{
  readonly decodedNonceBytes: number;
  readonly encodedBitCapacity: number;
  readonly meetsCallerLengthFloor: boolean;
}>;
const inputFields = [
  { id: "nonceBase64", label: "Nonce base64", kind: "string" },
  {
    id: "callerMinimumDecodedBits",
    label: "Caller minimum decoded bits",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.callerMinimumDecodedBits, "floor", 0, 32768);
  const s = input.nonceBase64;
  if (
    s.length > 5464 ||
    !s.length ||
    s.length % 4 ||
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$(?![\s\S])/.test(
      s,
    )
  )
    simpleError("nonce", "Canonical padded standard Base64 required.");
  const a = "ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz0123456789+/",
    padding = s.endsWith("==") ? 2 : s.endsWith("=") ? 1 : 0;
  if (
    (padding === 2 && a.indexOf(s[s.length - 3]) % 16) ||
    (padding === 1 && a.indexOf(s[s.length - 2]) % 4)
  )
    simpleError("nonce", "Zero unused Base64 pad bits required.");
  const n = (s.length / 4) * 3 - padding;
  return {
    decodedNonceBytes: n,
    encodedBitCapacity: 8 * n,
    meetsCallerLengthFloor: 8 * n >= input.callerMinimumDecodedBits,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  nonceBase64: "AQIDBA==",
  callerMinimumDecodedBits: 32,
} satisfies Input;
export const exampleOutput = {
  decodedNonceBytes: 4,
  encodedBitCapacity: 32,
  meetsCallerLengthFloor: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/csp-nonce-base64-length-bits-checker",
  title: "CSP Nonce Base64 Length Bits Check",
  description:
    "Audit CSP nonce canonical Base64 decoded length only, bytes×8 is capacity not observed entropy; no nonce randomness, uniqueness or CSP effectiveness certification.",
  inputs: inputFields,
  outputs: [
    { id: "decodedNonceBytes", label: "Decoded nonce bytes", kind: "number" },
    { id: "encodedBitCapacity", label: "Encoded bit capacity", kind: "number" },
    {
      id: "meetsCallerLengthFloor",
      label: "Meets caller length floor",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      nonceBase64: value.nonceBase64 as string,
      callerMinimumDecodedBits: value.callerMinimumDecodedBits as number,
    }),
});
export const run = tool.execute;
export default tool;
