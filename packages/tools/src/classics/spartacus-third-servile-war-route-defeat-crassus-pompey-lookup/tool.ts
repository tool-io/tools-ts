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
          "Spartacus revolt is conventionally73\u201371 BCE; Crassus led the main final campaign, and Pompey intercepted fugitives.",
        reference:
          "Plutarch, Crassus8\u201311; Appian, Civil Wars 1.116\u2013120.",
        limitations:
          "Ancient route, size and motive accounts vary; no complete certain march map or battle instructions.",
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
      text: "Spartacus revolt is conventionally73\u201371 BCE; Crassus led the main final campaign, and Pompey intercepted fugitives.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/spartacus-third-servile-war-route-defeat-crassus-pompey-lookup",
  title: "Spartacus Third Servile War Route Defeat Crassus Pompey Lookup",
  description:
    "Bounded offline reference: Spartacus revolt is conventionally73\u201371 BCE; Crassus led the main final campaign, and Pompey intercepted fugitives. Source: Plutarch, Crassus8\u201311; Appian, Civil Wars 1.116\u2013120. Ancient route, size and motive accounts vary; no complete certain march map or battle instructions. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
