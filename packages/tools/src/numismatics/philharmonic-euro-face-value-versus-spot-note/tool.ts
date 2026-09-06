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
          "Bullion-coin face value and metal-market value are different quantities; Philharmonic products use euro denominations in eligible issues.",
        reference: "Austrian Mint, Philharmonic product descriptions.",
        limitations:
          "No live spot quote or guaranteed legal redemption at metal value; issue/date matter.",
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
      text: "Bullion-coin face value and metal-market value are different quantities; Philharmonic products use euro denominations in eligible issues.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/philharmonic-euro-face-value-versus-spot-note",
  title: "Philharmonic Euro Face Value Versus Spot Note",
  description:
    "Bounded offline reference: Bullion-coin face value and metal-market value are different quantities; Philharmonic products use euro denominations in eligible issues. Source: Austrian Mint, Philharmonic product descriptions. No live spot quote or guaranteed legal redemption at metal value; issue/date matter. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
