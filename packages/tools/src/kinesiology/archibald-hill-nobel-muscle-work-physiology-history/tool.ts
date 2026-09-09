import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch47-shared.js";
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
          "A.V.Hillshared the1922NobelPrizefor research on heat production in muscle, with Otto Meyerhof honored for related muscle-metabolism work.",
        reference: "NobelPrize1922physiology/medicine record.",
        limitations:
          "Historical award context, not universal applicability of a single muscle model.",
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
      text: "A.V.Hillshared the1922NobelPrizefor research on heat production in muscle, with Otto Meyerhof honored for related muscle-metabolism work.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/archibald-hill-nobel-muscle-work-physiology-history",
  title: "Archibald Hill Nobel Muscle Work Physiology History",
  description:
    "Bounded offline reference: A.V.Hillshared the1922NobelPrizefor research on heat production in muscle, with Otto Meyerhof honored for related muscle-metabolism work. Source: NobelPrize1922physiology/medicine record. Historical award context, not universal applicability of a single muscle model. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
