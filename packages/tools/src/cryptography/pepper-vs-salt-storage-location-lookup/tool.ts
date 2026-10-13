import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly component: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "component", label: "Component", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  return {
    reference: pick(
      i.component,
      {
        salt: "Unique public per-record salt stored with the verifier.",
        pepper:
          "Secret independently managed pepper kept apart from verifier storage; key management and rotation are separate design concerns.",
      },
      "component",
    ),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { component: "salt" },
  output: {
    result: {
      reference: "Unique public per-record salt stored with the verifier.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/pepper-vs-salt-storage-location-lookup",
  title: "Pepper vs Salt Storage Lookup",
  description:
    "Bounded password-verifier storage distinction; not a complete password architecture or security approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { reference: { type: "string" } },
        required: ["reference"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
