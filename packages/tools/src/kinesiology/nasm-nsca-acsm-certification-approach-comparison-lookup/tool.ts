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
          "NASM, NSCAand ACSM credential approaches differ by programme, population, requirements and scope.",
        reference: "Official credential programme descriptions.",
        limitations:
          "No universal ranking, current eligibility or equivalence of every credential; verify actual edition/authority.",
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
      text: "NASM, NSCAand ACSM credential approaches differ by programme, population, requirements and scope.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/nasm-nsca-acsm-certification-approach-comparison-lookup",
  title: "NASM NSCA ACSM Certification Approach Comparison Lookup",
  description:
    "Bounded offline reference: NASM, NSCAand ACSM credential approaches differ by programme, population, requirements and scope. Source: Official credential programme descriptions. No universal ranking, current eligibility or equivalence of every credential; verify actual edition/authority. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
