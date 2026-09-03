import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
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
          "Greek fire describes Byzantine incendiary traditions whose precise historical formulations/delivery details remain uncertain.",
        reference: "Byzantine literary and military-history scholarship.",
        limitations:
          "No incendiary recipe, manufacturing instructions or claim of a fully recovered secret formula.",
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
      text: "Greek fire describes Byzantine incendiary traditions whose precise historical formulations/delivery details remain uncertain.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/greek-fire-byzantine-secret-weapon-lost-formula-lookup",
  title: "Greek Fire Byzantine Secret Weapon Lost Formula Lookup",
  description:
    "Bounded offline reference: Greek fire describes Byzantine incendiary traditions whose precise historical formulations/delivery details remain uncertain. Source: Byzantine literary and military-history scholarship. No incendiary recipe, manufacturing instructions or claim of a fully recovered secret formula. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
