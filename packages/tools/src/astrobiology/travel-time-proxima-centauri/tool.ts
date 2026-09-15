import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{ readonly fractionOfC: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "fractionOfC", label: "Fraction of c", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.fractionOfC, "speed");
  if (i.fractionOfC >= 1) simpleError("speed", "Massive ship 0<v/c<1.");
  return { coordinateTravelYears: 4.2465 / i.fractionOfC };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { fractionOfC: 0.1 },
  output: { result: { coordinateTravelYears: 42.465 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/travel-time-proxima-centauri",
  title: "Travel Time to Proxima Centauri at Given v/c Calculator",
  description:
    "Ideal coordinate travel years to an illustrative 4.2465-lightyear Proxima distance; no acceleration, proper time or updated distance guarantee.",
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
