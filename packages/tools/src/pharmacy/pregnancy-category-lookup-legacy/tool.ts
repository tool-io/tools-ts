import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch49-shared.js";
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
        legacy:
          "US FDAlegacyA/B/C/D/Xpregnancyletters were replaced for prescription drugs/biologics by narrative PregnancyandLactationLabelingRulesections. Do not treat a letter as quantitative fetal risk or current prescribingapproval.",
        authority:
          "FDA PLLR final rule2014, effective2015; current product labeling, patient context and qualified clinical review are required.",
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
  input: { topic: "legacy" },
  output: {
    result: {
      text: "US FDAlegacyA/B/C/D/Xpregnancyletters were replaced for prescription drugs/biologics by narrative PregnancyandLactationLabelingRulesections. Do not treat a letter as quantitative fetal risk or current prescribingapproval.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/pregnancy-category-lookup-legacy",
  title: "Legacy Pregnancy Category Lookup",
  description:
    "Bounded off line reference: FDA legacy pregnancy category framework, not a live medication-specific category database. Explicit topics legacy, authority. No full/live authority, clinical diagnosis, safe-use approval or universal individual outcome.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
