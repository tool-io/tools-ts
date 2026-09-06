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
          "Charles EB arber designed the Barber dime, quarter and half-dollar series.",
        reference: "US Mint, Barber coinage histories.",
        limitations:
          "A common designer does not make all denominations identical issues or certify a specimen.",
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
      text: "Charles EB arber designed the Barber dime, quarter and half-dollar series.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/barber-uniform-series-charles-barber-designer-lookup",
  title: "Barber Uniform Series Charles Barber Designer Lookup",
  description:
    "Bounded offline reference: Charles EB arber designed the Barber dime, quarter and half-dollar series. Source: US Mint, Barber coinage histories. A common designer does not make all denominations identical issues or certify a specimen. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
