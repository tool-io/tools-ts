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
          "Alarics forces sacked Rome in 410 CE; contemporary Christian and non-Christian responses differed.",
        reference: "Augustine, City of God; Jerome letters; Orosius.",
        limitations:
          "Rhetorical shock is not a quantified universal public reaction or immediate end of the Roman state.",
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
      text: "Alarics forces sacked Rome in 410 CE; contemporary Christian and non-Christian responses differed.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/sack-of-rome-410-alaric-shock-contemporary-reactions-lookup",
  title: "Sack of Rome, 410 AD (Alaric): Shock Contemporary Reactions Lookup",
  description:
    "Bounded offline reference: Alarics forces sacked Rome in 410 CE; contemporary Christian and non-Christian responses differed. Source: Augustine, City of God; Jerome letters; Orosius. Rhetorical shock is not a quantified universal public reaction or immediate end of the Roman state. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
