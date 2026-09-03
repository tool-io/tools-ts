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
          "Ostia developed as Romes maritime/river-port settlement with housing, warehouses, trades and changing links to Portus.",
        reference: "Ostia archaeological research.",
        limitations:
          "Not an unchanged single-period city or every building necessarily an insula/trade depot.",
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
      text: "Ostia developed as Romes maritime/river-port settlement with housing, warehouses, trades and changing links to Portus.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/ostia-antica-port-city-insulae-trade-hub-lookup",
  title: "Ostia Antica Port City Insulae Trade Hub Lookup",
  description:
    "Bounded offline reference: Ostia developed as Romes maritime/river-port settlement with housing, warehouses, trades and changing links to Portus. Source: Ostia archaeological research. Not an unchanged single-period city or every building necessarily an insula/trade depot. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
