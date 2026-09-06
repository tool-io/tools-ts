import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick, unique } from "../batch45-shared.js";
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
          "Wuzhu coin traditions extend across multiple dynasties; Kaiyuan Tongbao began in the Tang period in 621 CE.",
        reference: "Chinese numismatic catalogues and Tang monetary histories.",
        limitations:
          "Legends continued through copies/reissues; inscription alone is not a unique date or dynasty attribution.",
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
      text: "Wuzhu coin traditions extend across multiple dynasties; Kaiyuan Tongbao began in the Tang period in 621 CE.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/wuzhu-kaiyuan-tongbao-dynasty-span-taxonomy-lookup",
  title: "Wuzhu Kaiyuan Tongbao Dynasty Span Taxonomy Lookup",
  description:
    "Bounded offline reference: Wuzhu coin traditions extend across multiple dynasties; Kaiyuan Tongbao began in the Tang period in 621 CE. Source: Chinese numismatic catalogues and Tang monetary histories. Legends continued through copies/reissues; inscription alone is not a unique date or dynasty attribution. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
