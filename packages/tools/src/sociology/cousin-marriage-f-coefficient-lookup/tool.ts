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
    enum: [
      "firstCousins",
      "secondCousins",
      "firstCousinsOnceRemoved",
      "limitations",
    ],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        firstCousins:
          "For ordinary first-cousin parents with unrelated non-inbred founders, F=1/16in the simple pedigree.",
        secondCousins:
          "For ordinary second-cousin parents under the same assumptions, F=1/64.",
        firstCousinsOnceRemoved:
          "For first cousins once removed under the same assumptions, F=1/32.",
        limitations:
          "Additional shared ancestry, inbred founders and multiple paths alter F; no diagnosis or marriage advice.",
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
  input: { topic: "firstCousins" },
  output: {
    result: {
      text: "For ordinary first-cousin parents with unrelated non-inbred founders, F=1/16in the simple pedigree.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/cousin-marriage-f-coefficient-lookup",
  title: "Cousin Marriage F Coefficient Lookup",
  description:
    "Bounded offline reference: Conventional offspring inbreeding coefficients depend on pedigree paths and shared ancestors, not cousin labels alone. Source: Population genetics pedigree theory. Bounded simple unrelated-founder pedigree examples, not medical/genetic risk prediction. Only explicit topic keys supported: firstCousins, secondCousins, firstCousinsOnceRemoved, limitations. No complete external corpus, live data or personal assessment implied.",
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
