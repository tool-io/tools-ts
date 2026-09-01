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
          "Averaged-face attractiveness findings depend on sampling, image construction, task and observer populations.",
        reference: "Langlois and Roggman 1990; later face-perception research.",
        limitations:
          "Not a universal beauty ranking, identity inference or recommendation to alter appearance.",
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
      text: "Averaged-face attractiveness findings depend on sampling, image construction, task and observer populations.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/averageness-attractiveness-face-findings-verdict-lookup",
  title: "Averageness Attractiveness Face Findings Verdict Lookup",
  description:
    "Bounded offline reference: Averaged-face attractiveness findings depend on sampling, image construction, task and observer populations. Source: Langlois and Roggman 1990; later face-perception research. Not a universal beauty ranking, identity inference or recommendation to alter appearance. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
