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
          "Brechtian epic-theatre devices can include placards, projection and direct framing that foreground social interpretation.",
        reference: "Brecht, epic-theatre essays.",
        limitations:
          "A placard alone does not establish a Brechtian effect or every spectators critical response.",
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
      text: "Brechtian epic-theatre devices can include placards, projection and direct framing that foreground social interpretation.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/brecht-epic-placard-projection-fourth-wall-technique-lookup",
  title: "Brecht Epic Placard Projection Fourth Wall Technique Lookup",
  description:
    "Bounded offline reference: Brechtian epic-theatre devices can include placards, projection and direct framing that foreground social interpretation. Source: Brecht, epic-theatre essays. A placard alone does not establish a Brechtian effect or every spectators critical response. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
