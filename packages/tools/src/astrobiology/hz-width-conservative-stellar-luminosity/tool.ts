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
  readonly callerRunawayGreenhouseFlux: number;
  readonly callerMaximumGreenhouseFlux: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "luminositySolar", label: "Luminosity solar", kind: "number" },
  {
    id: "callerRunawayGreenhouseFlux",
    label: "Caller runaway greenhouse flux",
    kind: "number",
  },
  {
    id: "callerMaximumGreenhouseFlux",
    label: "Caller maximum greenhouse flux",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.luminositySolar, "luminosity");
  positive(i.callerRunawayGreenhouseFlux, "inner flux");
  positive(i.callerMaximumGreenhouseFlux, "outer flux");
  if (i.callerRunawayGreenhouseFlux <= i.callerMaximumGreenhouseFlux)
    simpleError("flux", "Inner effective flux must exceed outer.");
  const a = Math.sqrt(i.luminositySolar / i.callerRunawayGreenhouseFlux),
    b = Math.sqrt(i.luminositySolar / i.callerMaximumGreenhouseFlux);
  return { innerAu: a, outerAu: b, widthAu: b - a };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    luminositySolar: 1,
    callerRunawayGreenhouseFlux: 1,
    callerMaximumGreenhouseFlux: 0.25,
  },
  output: { result: { innerAu: 1, outerAu: 2, widthAu: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/hz-width-conservative-stellar-luminosity",
  title: "Conservative HZ Width for Stellar Luminosity Calculator",
  description:
    "Conditional width HZ endpoints from caller independently applicable effective-flux criteria; no proof of water, atmosphere or life.",
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
