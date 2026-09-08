import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
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
          "USIRSIP PINs are six-digit identity-protection identifiers used in specified tax-return processes; annual communications can include CP01A.",
        reference: "IRS, Get an Identity Protection PIN; CP01Anotice guidance.",
        limitations:
          "Letter6319is associated with certain identity-verification communications, not a universal annual IP PIN letter; never enter or disclose a real PIN here.",
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
      text: "USIRSIP PINs are six-digit identity-protection identifiers used in specified tax-return processes; annual communications can include CP01A.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/ip-pin-identity-protection-pin-annual-letter-6319-enrollment",
  title: "Ip Pin Identity Protection Pin Annual Letter 6319 Enrollment",
  description:
    "Bounded offline reference: USIRSIP PINs are six-digit identity-protection identifiers used in specified tax-return processes; annual communications can include CP01A. Source: IRS, Get an Identity Protection PIN; CP01Anotice guidance. Letter6319is associated with certain identity-verification communications, not a universal annual IP PIN letter; never enter or disclose a real PIN here. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
