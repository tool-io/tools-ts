import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly algorithm: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "algorithm", label: "Algorithm", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  return {
    reference: pick(
      i.algorithm,
      {
        "SHA-1": 160,
        "SHA-224": 224,
        "SHA-256": 256,
        "SHA-384": 384,
        "SHA-512": 512,
        "SHA-512/224": 224,
        "SHA-512/256": 256,
        "SHA3-224": 224,
        "SHA3-256": 256,
        "SHA3-384": 384,
        "SHA3-512": 512,
      },
      "algorithm",
    ),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { algorithm: "SHA-256" },
  output: { result: { reference: 256 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/sha-family-output-bit-lengths-lookup",
  title: "SHA Family Output Bit Lengths Lookup",
  description:
    "Fixed SHA digest output bits; SHAKE is variable-length and excluded; output length does not establish algorithm security.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { reference: { type: "number" } },
        required: ["reference"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
