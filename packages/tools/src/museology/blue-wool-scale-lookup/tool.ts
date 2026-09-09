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
    enum: ["direction", "iso", "aatcc", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        direction:
          "Under a declared matching Blue Wool set, larger ratings indicate greater lightfastness.",
        iso: "ISOBlue Wool1\u20138references use specified exposure/comparison conditions.",
        aatcc:
          "AATCCreference designations/conditions must not be silently substituted for ISO1\u20138.",
        limitations:
          "Actual artwork response, exposure spectrum, temperature and RH may differ from test textiles.",
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
  input: { topic: "direction" },
  output: {
    result: {
      text: "Under a declared matching Blue Wool set, larger ratings indicate greater lightfastness.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/blue-wool-scale-lookup",
  title: "Blue Wool Standard Fade Comparison Scale Lookup",
  description:
    "Bounded offline reference: Blue Wool references commonly run1(low lightfastness) to8(high lightfastness), with separate test conventions such as ISO and AATCCsystems. Source: ISO105-B02and textile lightfastness reference methodology. Not direct object lifetime, lux-safe limit or universal equivalence of every reference set. Only explicit topic keys supported: direction, iso, aatcc, limitations. No complete external corpus, live data or personal assessment implied.",
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
