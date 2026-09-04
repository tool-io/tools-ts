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
          "Rumpelstiltskin centers on discovering a secret name in familiar versions, which changes the bargaining relationship.",
        reference: "Grimm, KHM55; comparative tale studies.",
        limitations:
          "Literary motif analysis does not establish magical power of real names.",
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
      text: "Rumpelstiltskin centers on discovering a secret name in familiar versions, which changes the bargaining relationship.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/rumpelstiltskin-power-of-names-theme-analysis-lookup",
  title: "Rumpelstiltskin Power of Names Theme Analysis Lookup",
  description:
    "Bounded offline reference: Rumpelstiltskin centers on discovering a secret name in familiar versions, which changes the bargaining relationship. Source: Grimm, KHM55; comparative tale studies. Literary motif analysis does not establish magical power of real names. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
