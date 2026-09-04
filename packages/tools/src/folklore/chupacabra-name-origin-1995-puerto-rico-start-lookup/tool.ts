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
          "Chupacabra reports became prominent in Puerto Rico in 1995 and later circulated through varied descriptions.",
        reference: "Radford, Tracking the Chupacabra.",
        limitations:
          "Chronology of a legend is not biological proof or a verdict on every animal incident.",
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
      text: "Chupacabra reports became prominent in Puerto Rico in 1995 and later circulated through varied descriptions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/chupacabra-name-origin-1995-puerto-rico-start-lookup",
  title: "Chupacabra Name Origin 1995 Puerto Rico Start Lookup",
  description:
    "Bounded offline reference: Chupacabra reports became prominent in Puerto Rico in 1995 and later circulated through varied descriptions. Source: Radford, Tracking the Chupacabra. Chronology of a legend is not biological proof or a verdict on every animal incident. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
