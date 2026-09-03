import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly passphrase: string;
  readonly allowRaw64HexPsk: boolean;
}>;
export type Output = Readonly<{
  readonly printableAsciiPassphraseValid: boolean;
  readonly rawHexPskValid: boolean;
  readonly acceptedInputForm: string;
}>;
const inputFields = [
  { id: "passphrase", label: "Passphrase", kind: "string" },
  { id: "allowRaw64HexPsk", label: "Allow raw64 hex psk", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.passphrase.length > 128)
    simpleError("input", "At most128 characters to inspect WPA input form.");
  const printable =
      input.passphrase.length >= 8 &&
      input.passphrase.length <= 63 &&
      /^[ -~]+$(?![\s\S])/.test(input.passphrase),
    hex =
      input.allowRaw64HexPsk &&
      /^[0-9A-Fa-f]{64}$(?![\s\S])/.test(input.passphrase);
  return {
    printableAsciiPassphraseValid: printable,
    rawHexPskValid: hex,
    acceptedInputForm: printable ? "passphrase" : hex ? "raw-psk" : "invalid",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  passphrase: "abcdefgh",
  allowRaw64HexPsk: true,
} satisfies Input;
export const exampleOutput = {
  printableAsciiPassphraseValid: true,
  rawHexPskValid: false,
  acceptedInputForm: "passphrase",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/wpa-passphrase-length-charset-checker",
  title: "WPA Passphrase Length/Charset Check",
  description:
    "Check legacy WPA printable-ASCII8–63 passphrase versus explicitly allowed64-hex raw PSK form; no password strength, WPA3 compatibility or authentication.",
  inputs: inputFields,
  outputs: [
    {
      id: "printableAsciiPassphraseValid",
      label: "Printable ascii passphrase valid",
      kind: "boolean",
    },
    { id: "rawHexPskValid", label: "Raw hex psk valid", kind: "boolean" },
    { id: "acceptedInputForm", label: "Accepted input form", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      passphrase: value.passphrase as string,
      allowRaw64HexPsk: value.allowRaw64HexPsk as boolean,
    }),
});
export const run = tool.execute;
export default tool;
