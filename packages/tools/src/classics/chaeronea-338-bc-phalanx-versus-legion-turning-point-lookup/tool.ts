import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch44-shared.js";

export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Chaeronea 338 BCE pitted PhilipIIand Macedonian forces against a Greek coalition, not a Roman legion.",
        reference: "Diodorus 16.85\u201386; Plutarch, Alexander 9.",
        limitations:
          "The milestones phalanx-versus-legion premise is incorrect; Roman encounters such as Cynoscephalae 197 BCE are separate events.",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { topic: "summary" },
  output: {
    result: {
      text: "Chaeronea 338 BCE pitted PhilipIIand Macedonian forces against a Greek coalition, not a Roman legion.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/chaeronea-338-bc-phalanx-versus-legion-turning-point-lookup",
  title: "Chaeronea 338 BC Phalanx Versus Legion Turning Point Lookup",
  description:
    "Bounded offline reference: Chaeronea 338 BCE pitted PhilipIIand Macedonian forces against a Greek coalition, not a Roman legion. Source: Diodorus 16.85\u201386; Plutarch, Alexander 9. The milestones phalanx-versus-legion premise is incorrect; Roman encounters such as Cynoscephalae 197 BCE are separate events. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
