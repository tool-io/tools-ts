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
          "Full Bell Lines designations concern specified horizontal lines near the base of the Franklin half dollars bell.",
        reference: "PCGS/NGC FBL designation descriptions.",
        limitations:
          "Services examine different line groups/criteria; not a universal grade increment or authenticity test.",
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
      text: "Full Bell Lines designations concern specified horizontal lines near the base of the Franklin half dollars bell.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/full-bell-lines-fbl-franklin-half-designation",
  title: "Full Bell Lines FBL Franklin Half Designation",
  description:
    "Bounded offline reference: Full Bell Lines designations concern specified horizontal lines near the base of the Franklin half dollars bell. Source: PCGS/NGC FBL designation descriptions. Services examine different line groups/criteria; not a universal grade increment or authenticity test. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
