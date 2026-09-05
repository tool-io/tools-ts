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
          "US risk retention groups cover specified liability exposures under the Liability Risk Retention Actframework.",
        reference: "Liability Risk Retention Act 1986; NAIC, RRG materials.",
        limitations:
          "Not permission to write every property/life line or exemption from all state oversight.",
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
      text: "US risk retention groups cover specified liability exposures under the Liability Risk Retention Actframework.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/risk-retention-group-rrg-liability-lines-act-origin-lookup",
  title: "Risk Retention Group RRG Liability Lines Act Origin Lookup",
  description:
    "Bounded offline reference: US risk retention groups cover specified liability exposures under the Liability Risk Retention Actframework. Source: Liability Risk Retention Act 1986; NAIC, RRG materials. Not permission to write every property/life line or exemption from all state oversight. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
