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
          "US Rule506(b) and506(c) offerings differ notably in general-solicitation permission and purchaser/accreditation requirements.",
        reference: "SEC, Regulation DR ules506(b),506(c).",
        limitations:
          "Both have other conditions and exclusions; this is not a complete exemption or solicitation-approval test.",
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
      text: "US Rule506(b) and506(c) offerings differ notably in general-solicitation permission and purchaser/accreditation requirements.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/reg-d-506b-versus-506c-general-solicitation-difference-lookup",
  title: "Reg D 506b Versus 506c General Solicitation Difference Lookup",
  description:
    "Bounded offline reference: US Rule506(b) and506(c) offerings differ notably in general-solicitation permission and purchaser/accreditation requirements. Source: SEC, Regulation DR ules506(b),506(c). Both have other conditions and exclusions; this is not a complete exemption or solicitation-approval test. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
