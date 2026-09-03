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
          "Heron describes the aeolipile, a steam-driven rotating demonstration, in Pneumatica.",
        reference: "Heron, Pneumatica 2.11in common numbering.",
        limitations:
          "Not proof of an unused industrial steam engine or a simple technological reason for absent industrialization; no pressure-vessel instructions.",
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
      text: "Heron describes the aeolipile, a steam-driven rotating demonstration, in Pneumatica.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/hero-alexandria-aeolipile-steam-device-unused-application",
  title: "Hero Alexandria Aeolipile Steam Device Unused Application",
  description:
    "Bounded offline reference: Heron describes the aeolipile, a steam-driven rotating demonstration, in Pneumatica. Source: Heron, Pneumatica 2.11in common numbering. Not proof of an unused industrial steam engine or a simple technological reason for absent industrialization; no pressure-vessel instructions. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
