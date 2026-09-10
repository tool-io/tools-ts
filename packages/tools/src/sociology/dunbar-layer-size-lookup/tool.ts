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
    enum: ["inner", "sympathy", "affinity", "active", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        inner:
          "An approximate5-person close/support layer is commonly discussed.",
        sympathy:
          "An approximate15-person sympathy layer is commonly discussed.",
        affinity:
          "An approximate50-person affinity layer is commonly discussed.",
        active:
          "An approximate150-person active network is commonly discussed.",
        limitations:
          "Layer boundaries, measurement and population vary; do not diagnose social ability from counts.",
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
  input: { topic: "inner" },
  output: {
    result: {
      text: "An approximate5-person close/support layer is commonly discussed.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/dunbar-layer-size-lookup",
  title: "Dunbar Layer Size Lookup",
  description:
    "Bounded offline reference: Dunbar-associated social-network layers are often described near5,15,50,150with larger layers, as approximate research patterns. Source: Dunbar, social brain/social network layer research. Not a universal personal capacity or required relationship quota. Only explicit topic keys supported: inner, sympathy, affinity, active, limitations. No complete external corpus, live data or personal assessment implied.",
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
