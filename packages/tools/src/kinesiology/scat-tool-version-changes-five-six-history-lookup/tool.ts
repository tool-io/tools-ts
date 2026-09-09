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
          "SCAT5and SCAT6represent different concussion assessment editions with revised components and guidance.",
        reference: "CISGSCAT5/SCAT6publications.",
        limitations:
          "Age versions, time windows and qualified administration matter; not an automated diagnosis.",
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
      text: "SCAT5and SCAT6represent different concussion assessment editions with revised components and guidance.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/scat-tool-version-changes-five-six-history-lookup",
  title: "Scat Tool Version Changes Five Six History Lookup",
  description:
    "Bounded offline reference: SCAT5and SCAT6represent different concussion assessment editions with revised components and guidance. Source: CISGSCAT5/SCAT6publications. Age versions, time windows and qualified administration matter; not an automated diagnosis. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
