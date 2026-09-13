import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualReferrerPolicyAttributeValue: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualReferrerPolicyAttributeValue",
    label: "Actual referrer policy attribute value",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const k = input.actualReferrerPolicyAttributeValue.trim().toLowerCase(),
    yes = [
      "no-referrer",
      "no-referrer-when-downgrade",
      "same-origin",
      "origin",
      "strict-origin",
      "origin-when-cross-origin",
      "strict-origin-when-cross-origin",
      "unsafe-url",
    ].includes(k);
  return { recognizedAttributePolicy: yes, attributePolicy: yes ? k : "" };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualReferrerPolicyAttributeValue: "strict-origin-when-cross-origin",
  },
  output: {
    result: {
      recognizedAttributePolicy: true,
      attributePolicy: "strict-origin-when-cross-origin",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/referrer-attribute-parser",
  title: "Referrer Attribute Parser",
  description:
    "Parse ONEHTML referrer policy attribute enumonly, unknown/empty means no explicit recognized policy. Not comma-separated HTTP header last token selection, default document policy, actual ReferrerURLor network decision.",
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
