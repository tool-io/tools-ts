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
    enum: ["summary", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Singapores Centre for Strategic Futures supports anticipatory governance through horizon scanning, scenario work and public foresight publications.",
        reference:
          "SingaporeCentre for Strategic Futures official institutional descriptions.",
        limitations:
          "No live newsletter inventory, official advice or inferred government forecast.",
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
      text: "Singapores Centre for Strategic Futures supports anticipatory governance through horizon scanning, scenario work and public foresight publications.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/singapore-csf-centre-strategic-futures-signals-newsletter",
  title: "Singapore CSF Centre Strategic Futures Signals Newsletter",
  description:
    "Bounded offline reference: Singapores Centre for Strategic Futures supports anticipatory governance through horizon scanning, scenario work and public foresight publications. Source: SingaporeCentre for Strategic Futures official institutional descriptions. No live newsletter inventory, official advice or inferred government forecast. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
