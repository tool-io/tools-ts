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
          "Full Bands/Full Split Bands designations concern specified horizontal band detail on the Mercury dimes reverse fasces.",
        reference: "PCGS/NGC full-band designation descriptions.",
        limitations:
          "Service, grade and issue criteria differ; no automatic designation from one image or universal percent completion.",
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
      text: "Full Bands/Full Split Bands designations concern specified horizontal band detail on the Mercury dimes reverse fasces.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/full-split-bands-fsb-mercury-dime-designation",
  title: "Full Split Bands FSB Mercury Dime Designation",
  description:
    "Bounded offline reference: Full Bands/Full Split Bands designations concern specified horizontal band detail on the Mercury dimes reverse fasces. Source: PCGS/NGC full-band designation descriptions. Service, grade and issue criteria differ; no automatic designation from one image or universal percent completion. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
