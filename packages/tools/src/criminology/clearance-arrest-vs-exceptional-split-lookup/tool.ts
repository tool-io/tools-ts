import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch46-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["arrest", "exceptional", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        arrest:
          "Clearance by arrest requires the standards specified arrest, charge and related reporting conditions.",
        exceptional:
          "Exceptional clearance requires specified offender identification/evidence/location conditions and an obstacle outside agency control.",
        limitations:
          "An arrest does not prove guilt, and clearance denominators/time cohorts may differ from incident totals.",
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
  input: { topic: "arrest" },
  output: {
    result: {
      text: "Clearance by arrest requires the standards specified arrest, charge and related reporting conditions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/clearance-arrest-vs-exceptional-split-lookup",
  title: "Clearance Arrest vs Exceptional Means Split Lookup",
  description:
    "Bounded offline reference: Arrest clearance and exceptional clearance are different statistical concepts under a particular recording standard. Source: FBI, UCRclearance definitions. Exceptional clearance has specified criteria and does not mean every unsolved case or prosecution outcome. Only explicit topic keys supported: arrest, exceptional, limitations. No complete external corpus, live data or personal assessment implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
