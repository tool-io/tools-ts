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
          "Piano-vocal scores condense vocal lines/accompaniment for rehearsal and may omit orchestral details.",
        reference: "Musical-theatre score preparation practice.",
        limitations:
          "Annotations belong to a verified edition and permissions; no assumption every PVscore has identical content.",
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
      text: "Piano-vocal scores condense vocal lines/accompaniment for rehearsal and may omit orchestral details.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/piano-vocal-score-pvs-preparation-marking-guide",
  title: "Piano Vocal Score PV Score Preparation Marking Guide",
  description:
    "Bounded offline reference: Piano-vocal scores condense vocal lines/accompaniment for rehearsal and may omit orchestral details. Source: Musical-theatre score preparation practice. Annotations belong to a verified edition and permissions; no assumption every PVscore has identical content. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
