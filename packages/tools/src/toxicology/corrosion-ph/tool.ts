import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch48-shared.js";
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
          "Extreme pHcan be evidence relevant to corrosivity assessment, but pHalone does not determine every substances corrosivity or neutralization safety.",
        reference: "GHS skin/eye hazard assessment framework.",
        limitations:
          "Acid/alkali reserve, chemical identity, data applicability and authoritative classification are external; no pH-only corrosion diagnosis or handling approval.",
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
      text: "Extreme pHcan be evidence relevant to corrosivity assessment, but pHalone does not determine every substances corrosivity or neutralization safety.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/corrosion-ph",
  title: "Corrosion pH Calculator",
  description:
    "Bounded offline reference: Extreme pHcan be evidence relevant to corrosivity assessment, but pHalone does not determine every substances corrosivity or neutralization safety. Source: GHS skin/eye hazard assessment framework. Acid/alkali reserve, chemical identity, data applicability and authoritative classification are external; no pH-only corrosion diagnosis or handling approval. Topic keys: summary, reference, limitations. Not a complete/current reference corpus, individual outcome, legal/design compliance or safety certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
