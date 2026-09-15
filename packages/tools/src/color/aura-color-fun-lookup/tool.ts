import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly color: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "color", label: "Color", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.color,
      {
        red: "Entertainment association: energy.",
        orange: "Entertainment association: creativity.",
        yellow: "Entertainment association: optimism.",
        green: "Entertainment association: balance.",
        blue: "Entertainment association: calm.",
        violet: "Entertainment association: imagination.",
      },
      "color",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { color: "blue" },
  output: { result: { reference: "Entertainment association: calm." } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/aura-color-fun-lookup",
  title: "Aura Color Fun Lookup",
  description:
    "Bounded fictional aura-color associations for amusement, not measurement of personality, spirituality or health.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
