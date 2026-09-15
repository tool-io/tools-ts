import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch52-shared.js";
export type Input = Readonly<{ readonly delaySeconds: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "delaySeconds", label: "Delay seconds", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.delaySeconds, "delay");
  return { approximateDistanceKm: i.delaySeconds / 3 };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { delaySeconds: 9 },
  output: { result: { approximateDistanceKm: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/thunder-delay-3-second-km-rule",
  title: "Thunder Delay 3 Second KM Rule Converter",
  description:
    "Explicit rough 3 seconds/km thunder-distance heuristic; ignores temperature/light travel and is not lightning safety guidance.",
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
