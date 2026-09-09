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
          "Graduated concussion return-to-sport frameworks progress from symptom-limited activity through increasing sport participation, with contemporary staged safeguards.",
        reference: "Amsterdam2022concussion consensus, published 2023.",
        limitations:
          "No automatic clearance after six steps; symptoms, minimum intervals, substeps and qualified medical review are essential.",
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
      text: "Graduated concussion return-to-sport frameworks progress from symptom-limited activity through increasing sport participation, with contemporary staged safeguards.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/concussion-return-to-play-six-stage-graduated-protocol",
  title: "Concussion Return to Play6-Stage Graduated Protocol",
  description:
    "Bounded offline reference: Graduated concussion return-to-sport frameworks progress from symptom-limited activity through increasing sport participation, with contemporary staged safeguards. Source: Amsterdam2022concussion consensus, published 2023. No automatic clearance after six steps; symptoms, minimum intervals, substeps and qualified medical review are essential. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
