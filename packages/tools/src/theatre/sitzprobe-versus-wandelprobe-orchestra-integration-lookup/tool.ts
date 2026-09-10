import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch46-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["summary", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Sitzprobe typically emphasizes seated integration of singers/orchestra; Wandelprobe adds movement/blocking elements in particular production usage.",
        reference: "Opera rehearsal practice.",
        limitations:
          "Terminology varies; neither label certifies vocal readiness or safe movement.",
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
      text: "Sitzprobe typically emphasizes seated integration of singers/orchestra; Wandelprobe adds movement/blocking elements in particular production usage.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/sitzprobe-versus-wandelprobe-orchestra-integration-lookup",
  title: "Sitzprobe Versus Wandelprobe Orchestra Integration Lookup",
  description:
    "Bounded offline reference: Sitzprobe typically emphasizes seated integration of singers/orchestra; Wandelprobe adds movement/blocking elements in particular production usage. Source: Opera rehearsal practice. Terminology varies; neither label certifies vocal readiness or safe movement. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
