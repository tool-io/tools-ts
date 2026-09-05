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
          "Admitted insurers are licensed for relevant business in the jurisdiction; eligible nonadmitted placements operate under surplus-lines frameworks.",
        reference: "NAIC, surplus-lines consumer materials.",
        limitations:
          "Approval, taxes, guaranty protection and placement conditions vary; nonadmitted is not automatically illegal or unsafe.",
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
      text: "Admitted insurers are licensed for relevant business in the jurisdiction; eligible nonadmitted placements operate under surplus-lines frameworks.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/admitted-versus-nonadmitted-surplus-lines-distinction-lookup",
  title: "Admitted Versus Nonadmitted Surplus Lines Distinction Lookup",
  description:
    "Bounded offline reference: Admitted insurers are licensed for relevant business in the jurisdiction; eligible nonadmitted placements operate under surplus-lines frameworks. Source: NAIC, surplus-lines consumer materials. Approval, taxes, guaranty protection and placement conditions vary; nonadmitted is not automatically illegal or unsafe. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
