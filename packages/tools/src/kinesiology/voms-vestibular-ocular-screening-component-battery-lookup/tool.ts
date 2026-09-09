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
          "VOMSassesses symptom provocation across specified vestibular/ocular tasks within a screening protocol.",
        reference: "Muchaet al.2014, VOMSresearch.",
        limitations:
          "A component list does not administer the test, diagnose concussion or authorize return to sport.",
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
      text: "VOMSassesses symptom provocation across specified vestibular/ocular tasks within a screening protocol.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/voms-vestibular-ocular-screening-component-battery-lookup",
  title: "Voms Vestibular Ocular Screening Component Battery Lookup",
  description:
    "Bounded offline reference: VOMSassesses symptom provocation across specified vestibular/ocular tasks within a screening protocol. Source: Muchaet al.2014, VOMSresearch. A component list does not administer the test, diagnose concussion or authorize return to sport. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
