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
        villain: "Creates harm or struggle within the villain sphere.",
        donor: "Tests or prepares transfer of a magical agent.",
        helper: "Assists the hero in movement, tasks or rescue.",
        princessAndFather:
          "Sought person and father functions include tasks, recognition and marriage in Propps corpus.",
        dispatcher: "Sends or motivates departure.",
        hero: "Seeker or victim hero pursues or undergoes the action.",
        falseHero: "Makes unfounded claims or competes for recognition.",
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
  input: { topic: "villain" },
  output: {
    result: { text: "Creates harm or struggle within the villain sphere." },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/propp-sphere-of-action-role-lookup",
  title: "Propp Sphere of Action Role Lookup",
  description:
    "Bounded offline reference: Propp describes seven spheres of action, not a fixed count of characters. Source: Propp, Morphology of the Folktale, chapter 6. A character may occupy multiple spheres and a sphere may be distributed across characters. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
