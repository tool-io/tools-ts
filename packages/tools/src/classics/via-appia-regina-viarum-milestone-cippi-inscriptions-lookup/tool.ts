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
          "Via Appia milestones/cippi reflect route, imperial and inscriptional contexts; regina viarum is a literary epithet.",
        reference: "Statius, Silvae 2.2; Roman road archaeology.",
        limitations:
          "No single complete route-distance table or authentication from an inscription phrase alone.",
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
      text: "Via Appia milestones/cippi reflect route, imperial and inscriptional contexts; regina viarum is a literary epithet.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/via-appia-regina-viarum-milestone-cippi-inscriptions-lookup",
  title: "Via Appia Regina Viarum Milestone Cippi Inscriptions Lookup",
  description:
    "Bounded offline reference: Via Appia milestones/cippi reflect route, imperial and inscriptional contexts; regina viarum is a literary epithet. Source: Statius, Silvae 2.2; Roman road archaeology. No single complete route-distance table or authentication from an inscription phrase alone. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
