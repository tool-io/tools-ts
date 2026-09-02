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
          "Levine studies changing cultural hierarchies and reception, including Shakespeare, in the United States.",
        reference: "Levine, Highbrow/Lowbrow 1988.",
        limitations:
          "Not a timeless hierarchy of inherent human or artistic worth.",
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
      text: "Levine studies changing cultural hierarchies and reception, including Shakespeare, in the United States.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/highbrow-lowbrow-levine-shakespeare-america-history-lookup",
  title: "Highbrow Lowbrow Levine Shakespeare America History Lookup",
  description:
    "Bounded offline reference: Levine studies changing cultural hierarchies and reception, including Shakespeare, in the United States. Source: Levine, Highbrow/Lowbrow 1988. Not a timeless hierarchy of inherent human or artistic worth. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
