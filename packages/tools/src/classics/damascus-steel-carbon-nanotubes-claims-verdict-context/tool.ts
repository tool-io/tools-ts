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
          "Carbon-nanotube claims concern analysis of particular historical steel samples and do not settle every Damascus-steel mechanism or provenance.",
        reference: "Reibold et al, Nature 2006; metallurgical critiques.",
        limitations:
          "Sample-specific evidence is not a universal sword feature, recipe or proof of exceptional weapon performance.",
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
      text: "Carbon-nanotube claims concern analysis of particular historical steel samples and do not settle every Damascus-steel mechanism or provenance.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/damascus-steel-carbon-nanotubes-claims-verdict-context",
  title: "Damascus Steel Carbon Nanotubes Claims Verdict Context",
  description:
    "Bounded offline reference: Carbon-nanotube claims concern analysis of particular historical steel samples and do not settle every Damascus-steel mechanism or provenance. Source: Reibold et al, Nature 2006; metallurgical critiques. Sample-specific evidence is not a universal sword feature, recipe or proof of exceptional weapon performance. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
