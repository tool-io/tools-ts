import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly secretBase32: string;
  readonly allowUnpadded: boolean;
}>;
export type Output = Readonly<{
  readonly decodedSecretBytes: number;
  readonly paddingCharacters: number;
  readonly canonicalPadding: boolean;
}>;
const inputFields = [
  { id: "secretBase32", label: "Secret base32", kind: "string" },
  { id: "allowUnpadded", label: "Allow unpadded", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const s = input.secretBase32;
  if (!s.length || s.length > 6560 || !/^[A-Z2-7]+={0,6}$(?![\s\S])/.test(s))
    simpleError(
      "base32",
      "Uppercase RFC4648 Base32 without whitespace required.",
    );
  const raw = s.replace(/=+$/, ""),
    p = s.length - raw.length,
    rem = raw.length % 8,
    expected = ({ 0: 0, 2: 6, 4: 4, 5: 3, 7: 1 } as Record<number, number>)[
      rem
    ];
  if (
    expected === undefined ||
    (p !== expected && !(input.allowUnpadded && p === 0)) ||
    (p > 0 && s.length % 8)
  )
    simpleError(
      "padding",
      "Canonical RFC4648 padding or explicitly allowed unpadded form required.",
    );
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
    unused = (raw.length * 5) % 8;
  if (unused && alphabet.indexOf(raw.at(-1)!) % 2 ** unused)
    simpleError("padBits", "Zero unused Base32 pad bits required.");
  return {
    decodedSecretBytes: Math.floor((raw.length * 5) / 8),
    paddingCharacters: p,
    canonicalPadding: p === expected,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  secretBase32: "MY======",
  allowUnpadded: false,
} satisfies Input;
export const exampleOutput = {
  decodedSecretBytes: 1,
  paddingCharacters: 6,
  canonicalPadding: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/totp-secret-base32-padding-checker",
  title: "TOTP Secret Base32 Padding Check",
  description:
    "Check canonical TOTP secret Base32 padding/unused bits with explicit unpadded policy, not seed strength, OTP generation or provisioning verification.",
  inputs: inputFields,
  outputs: [
    { id: "decodedSecretBytes", label: "Decoded secret bytes", kind: "number" },
    { id: "paddingCharacters", label: "Padding characters", kind: "number" },
    { id: "canonicalPadding", label: "Canonical padding", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      secretBase32: value.secretBase32 as string,
      allowUnpadded: value.allowUnpadded as boolean,
    }),
});
export const run = tool.execute;
export default tool;
