import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch44-shared.js";

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
        summary:
          "Domitian-era informer narratives emerge in sources shaped by elite politics and later judgments.",
        reference: "Tacitus, Agricola; Pliny, Panegyric; Suetonius, Domitian.",
        limitations:
          "Delator accounts are not a complete independently verified surveillance registry or universal climate measure.",
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
      text: "Domitian-era informer narratives emerge in sources shaped by elite politics and later judgments.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/domitian-delator-informer-era-climate-lookup",
  title: "Domitian Delator Informer Era Climate Lookup",
  description:
    "Bounded offline reference: Domitian-era informer narratives emerge in sources shaped by elite politics and later judgments. Source: Tacitus, Agricola; Pliny, Panegyric; Suetonius, Domitian. Delator accounts are not a complete independently verified surveillance registry or universal climate measure. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
