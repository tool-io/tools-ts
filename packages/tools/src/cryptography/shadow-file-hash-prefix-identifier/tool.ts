import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch52-shared.js";
export type Input = Readonly<{ readonly storedHash: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "storedHash", label: "Stored hash", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  const prefix = i.storedHash.split("$")[1] ?? "";
  const label =
    (
      {
        "1": "MD5-crypt",
        "2a": "bcrypt",
        "2b": "bcrypt",
        "2y": "bcrypt",
        "5": "SHA-256-crypt",
        "6": "SHA-512-crypt",
        y: "yescrypt",
        gy: "gost-yescrypt",
      } as Record<string, string>
    )[prefix] ?? "unknown";
  return {
    prefixFamily: i.storedHash.startsWith("$") ? label : "unknown",
    lockedMarker: i.storedHash.startsWith("!") || i.storedHash.startsWith("*"),
    hashVerified: false,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { storedHash: "$6$salt$hash" },
  output: {
    result: {
      prefixFamily: "SHA-512-crypt",
      lockedMarker: false,
      hashVerified: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/shadow-file-hash-prefix-identifier",
  title: "Shadow File Hash Prefix Identifier",
  description:
    "Bounded shadow hash prefix recognition; locked prefixes retained, no password or full hash validity inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          prefixFamily: { type: "string" },
          lockedMarker: { type: "boolean" },
          hashVerified: { type: "boolean" },
        },
        required: ["prefixFamily", "lockedMarker", "hashVerified"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
