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
          "FITTorganizes exercise descriptions by frequency, intensity, time and type; later frameworks may add volume/progression.",
        reference: "ACSM exercise testing/prescription framework.",
        limitations:
          "An acronym does not establish an individualized safe exercise prescription or current edition details.",
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
      text: "FITTorganizes exercise descriptions by frequency, intensity, time and type; later frameworks may add volume/progression.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/acsm-guidelines-fitt-principle-edition-framework-lookup",
  title: "ACSM Guidelines Fitt Principle Edition Framework Lookup",
  description:
    "Bounded offline reference: FITTorganizes exercise descriptions by frequency, intensity, time and type; later frameworks may add volume/progression. Source: ACSM exercise testing/prescription framework. An acronym does not establish an individualized safe exercise prescription or current edition details. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
