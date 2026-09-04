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
          "Faust legends develop from early modern accounts associated with Georg/Johann Faust into chapbooks and major literary works.",
        reference: "Historia von D Johann Fausten1587; Marlowe; Goethe.",
        limitations:
          "Historical names/biography and supernatural pact narrative require separate evidence.",
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
      text: "Faust legends develop from early modern accounts associated with Georg/Johann Faust into chapbooks and major literary works.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/faust-pact-historical-georg-faust-figure-to-legend",
  title: "Faust Pact Historical Georg Faust Figure to Legend",
  description:
    "Bounded offline reference: Faust legends develop from early modern accounts associated with Georg/Johann Faust into chapbooks and major literary works. Source: Historia von D Johann Fausten1587; Marlowe; Goethe. Historical names/biography and supernatural pact narrative require separate evidence. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
