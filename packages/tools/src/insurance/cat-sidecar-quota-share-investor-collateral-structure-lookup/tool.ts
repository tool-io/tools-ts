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
          "A catastrophe sidecar can take a specified quota-share of underwriting risk supported by investor capital/collateral.",
        reference: "Reinsurance sidecar financing literature.",
        limitations:
          "Collateral and quota-share participation do not remove loss, liquidity, model or counterparty risks.",
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
      text: "A catastrophe sidecar can take a specified quota-share of underwriting risk supported by investor capital/collateral.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/cat-sidecar-quota-share-investor-collateral-structure-lookup",
  title: "Cat Sidecar Quota Share Investor Collateral Structure Lookup",
  description:
    "Bounded offline reference: A catastrophe sidecar can take a specified quota-share of underwriting risk supported by investor capital/collateral. Source: Reinsurance sidecar financing literature. Collateral and quota-share participation do not remove loss, liquidity, model or counterparty risks. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
