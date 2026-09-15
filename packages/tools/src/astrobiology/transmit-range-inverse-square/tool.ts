import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  range,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly referenceRangeMeters: number;
  readonly referenceEirpWatts: number;
  readonly proposedEirpWatts: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "referenceRangeMeters",
    label: "Reference range meters",
    kind: "number",
  },
  { id: "referenceEirpWatts", label: "Reference eirp watts", kind: "number" },
  { id: "proposedEirpWatts", label: "Proposed eirp watts", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.referenceRangeMeters, "range");
  positive(i.referenceEirpWatts, "reference");
  nonnegative(i.proposedEirpWatts, "power");
  return {
    conditionalRangeMeters:
      i.referenceRangeMeters *
      Math.sqrt(i.proposedEirpWatts / i.referenceEirpWatts),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    referenceRangeMeters: 1000,
    referenceEirpWatts: 100,
    proposedEirpWatts: 400,
  },
  output: { result: { conditionalRangeMeters: 2000 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/transmit-range-inverse-square",
  title: "Arecibo-style Transmit Range Inverse-Square Calculator",
  description:
    "Conditional equal-flux inverse-square detection range scaling at fixed receiver/background/bandwidth; not actual Arecibo link budget.",
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
