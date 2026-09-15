import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly luminositySolar: number;
  readonly callerRecentVenusFlux: number;
  readonly callerEarlyMarsFlux: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "luminositySolar", label: "Luminosity solar", kind: "number" },
  {
    id: "callerRecentVenusFlux",
    label: "Caller recent venus flux",
    kind: "number",
  },
  {
    id: "callerEarlyMarsFlux",
    label: "Caller early mars flux",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.luminositySolar, "luminosity");
  positive(i.callerRecentVenusFlux, "inner flux");
  positive(i.callerEarlyMarsFlux, "outer flux");
  if (i.callerRecentVenusFlux <= i.callerEarlyMarsFlux)
    simpleError("flux", "Inner effective flux must exceed outer.");
  const a = Math.sqrt(i.luminositySolar / i.callerRecentVenusFlux),
    b = Math.sqrt(i.luminositySolar / i.callerEarlyMarsFlux);
  return { innerAu: a, outerAu: b, widthAu: b - a };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    luminositySolar: 1,
    callerRecentVenusFlux: 1,
    callerEarlyMarsFlux: 0.25,
  },
  output: { result: { innerAu: 1, outerAu: 2, widthAu: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/hz-optimistic-venus-mars-limits",
  title: "Optimistic Venus-Mars HZ Limits Estimator Calculator",
  description:
    "Conditional optimistic HZ endpoints from caller independently applicable effective-flux criteria; no proof of water, atmosphere or life.",
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
