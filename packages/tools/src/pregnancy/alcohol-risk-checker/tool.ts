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
          "No amount or timing of alcohol use is established as safe during pregnancy; reported exposure does not determine an individual fetal outcome.",
        reference: "CDCpregnancy alcohol guidance.",
        limitations:
          "This reference is not a diagnosis, risk probability or blame assignment; qualified clinical support is appropriate for exposure concerns.",
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
      text: "No amount or timing of alcohol use is established as safe during pregnancy; reported exposure does not determine an individual fetal outcome.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/alcohol-risk-checker",
  title: "Alcohol Risk Checker",
  description:
    "Bounded offline reference: No amount or timing of alcohol use is established as safe during pregnancy; reported exposure does not determine an individual fetal outcome. Source: CDCpregnancy alcohol guidance. This reference is not a diagnosis, risk probability or blame assignment; qualified clinical support is appropriate for exposure concerns. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
