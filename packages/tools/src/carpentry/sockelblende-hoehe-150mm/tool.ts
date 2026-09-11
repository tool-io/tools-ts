import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch49-shared.js";
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
        nominalHeight:
          "Title-specificplinthfascia nominal height150mm. Actual installed height/tolerance and appliance ventilation clearance must beverified.",
        limitations: "Not a universal DIN kitchenplinthheight.",
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
  input: { topic: "nominalHeight" },
  output: {
    result: {
      text: "Title-specificplinthfascia nominal height150mm. Actual installed height/tolerance and appliance ventilation clearance must beverified.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "carpentry/sockelblende-hoehe-150mm",
  title: "Sockelblende H\u00f6he 150mm Lookup",
  description:
    "Bounded off line reference: Named milestone dimensional/condition reference only, not fabricated universal material rule. Explicit topics nominalHeight, limitations. No full/live authority, clinical diagnosis, safe-use approval or universal individual outcome.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
