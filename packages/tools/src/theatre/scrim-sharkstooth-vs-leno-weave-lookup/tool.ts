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
    enum: ["summary", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Sharkstooth and leno scrims differ in weave/construction, and perceived transparency depends on geometry and front/rear lighting.",
        reference: "Theatrical fabric manufacturer specifications.",
        limitations:
          "No universal concealment/strength/fire rating or inferred performance from the weave name.",
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
      text: "Sharkstooth and leno scrims differ in weave/construction, and perceived transparency depends on geometry and front/rear lighting.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/scrim-sharkstooth-vs-leno-weave-lookup",
  title: "Scrim Sharkstooth vs Leno Weave Lookup",
  description:
    "Bounded offline reference: Sharkstooth and leno scrims differ in weave/construction, and perceived transparency depends on geometry and front/rear lighting. Source: Theatrical fabric manufacturer specifications. No universal concealment/strength/fire rating or inferred performance from the weave name. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
