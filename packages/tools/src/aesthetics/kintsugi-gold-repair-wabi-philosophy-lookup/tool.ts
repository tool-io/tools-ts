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
          "Kintsugi names a repair tradition using lacquer with visible metallic decoration in particular ceramic contexts.",
        reference: "Japanese lacquer/ceramic conservation scholarship.",
        limitations:
          "Popular philosophy is not every historic makers intent; no adhesive, chemical or conservation-safety instructions.",
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
      text: "Kintsugi names a repair tradition using lacquer with visible metallic decoration in particular ceramic contexts.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/kintsugi-gold-repair-wabi-philosophy-lookup",
  title: "Kintsugi Gold Repair Wabi Philosophy Lookup",
  description:
    "Bounded offline reference: Kintsugi names a repair tradition using lacquer with visible metallic decoration in particular ceramic contexts. Source: Japanese lacquer/ceramic conservation scholarship. Popular philosophy is not every historic makers intent; no adhesive, chemical or conservation-safety instructions. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
