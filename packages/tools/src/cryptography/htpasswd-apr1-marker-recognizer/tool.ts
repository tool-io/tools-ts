import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch52-shared.js";
export type Input = Readonly<{ readonly storedHash: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "storedHash", label: "Stored hash", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  return {
    apr1PrefixPresent: i.storedHash.startsWith("$apr1$"),
    apr1SyntaxShape:
      /^\$apr1\$[./0-9A-Za-z]{1,8}\$[./0-9A-Za-z]{22}$(?![\s\S])/.test(
        i.storedHash,
      ),
    passwordVerified: false,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { storedHash: "$apr1$salt$aaaaaaaaaaaaaaaaaaaaaa" },
  output: {
    result: {
      apr1PrefixPresent: true,
      apr1SyntaxShape: true,
      passwordVerified: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/htpasswd-apr1-marker-recognizer",
  title: "htpasswd $apr1$ Marker Recognizer",
  description:
    "Recognize Apache APR1-MD5 marker and bounded textual shape only; no hash cracking, password verification or algorithm approval.",
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
          apr1PrefixPresent: { type: "boolean" },
          apr1SyntaxShape: { type: "boolean" },
          passwordVerified: { type: "boolean" },
        },
        required: ["apr1PrefixPresent", "apr1SyntaxShape", "passwordVerified"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
