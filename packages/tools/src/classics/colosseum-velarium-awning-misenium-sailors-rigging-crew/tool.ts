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
          "The Colosseum velarium used a complex awning arrangement, and ancient/museum accounts associate naval personnel with its operation.",
        reference:
          "Colosseum architectural scholarship; ancient imperial spectacle sources.",
        limitations:
          "Exact rigging reconstructions and crew numbers are uncertain; no safe rigging instructions or proven universal mechanism.",
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
      text: "The Colosseum velarium used a complex awning arrangement, and ancient/museum accounts associate naval personnel with its operation.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/colosseum-velarium-awning-misenium-sailors-rigging-crew",
  title: "Colosseum Velarium Awning Misenium Sailors Rigging Crew",
  description:
    "Bounded offline reference: The Colosseum velarium used a complex awning arrangement, and ancient/museum accounts associate naval personnel with its operation. Source: Colosseum architectural scholarship; ancient imperial spectacle sources. Exact rigging reconstructions and crew numbers are uncertain; no safe rigging instructions or proven universal mechanism. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
