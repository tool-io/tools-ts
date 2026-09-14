import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{ readonly serialHex: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "serialHex", label: "Serial hex", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  if (!/^[0-9A-Fa-f]+$(?![\s\S])/.test(i.serialHex) || i.serialHex.length > 40)
    simpleError("serial", "1–40 hexadecimal digits.");
  const n = BigInt("0x" + i.serialHex);
  return {
    evenHexLength: i.serialHex.length % 2 === 0,
    positive: n > 0n,
    unsignedOctets: Math.ceil(i.serialHex.length / 2),
    derSignPaddingNeeded:
      n.toString(16).length % 2 === 0 && parseInt(n.toString(16)[0], 16) >= 8,
    certificateValidityVerified: false,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { serialHex: "80" },
  output: {
    result: {
      evenHexLength: true,
      positive: true,
      unsignedOctets: 1,
      derSignPaddingNeeded: true,
      certificateValidityVerified: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/x509-serial-hex-length-parity-checker",
  title: "X.509 Serial Hex Length Parity Check",
  description:
    "X.509 serial hex layout screen up to 20 unsigned octets; DER signed integer padding reported separately, not full certificate validation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
