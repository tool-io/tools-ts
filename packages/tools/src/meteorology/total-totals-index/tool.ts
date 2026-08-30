import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../shared.js";

export type Input = Readonly<{
  readonly temperature850C: number;
  readonly dewpoint850C: number;
  readonly temperature500C: number;
}>;
export type Output = Readonly<{
  readonly verticalTotalsC: number;
  readonly crossTotalsC: number;
  readonly totalTotalsC: number;
}>;
const inputFields = [
  { id: "temperature850C", label: "Temperature850 c", kind: "number" },
  { id: "dewpoint850C", label: "Dewpoint850 c", kind: "number" },
  { id: "temperature500C", label: "Temperature500 c", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.dewpoint850C > input.temperature850C)
    simpleError("dewpoint", "Physical 850-hPa dewpoint required.");
  const verticalTotalsC = input.temperature850C - input.temperature500C,
    crossTotalsC = input.dewpoint850C - input.temperature500C;
  return {
    verticalTotalsC,
    crossTotalsC,
    totalTotalsC: verticalTotalsC + crossTotalsC,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  temperature850C: 20,
  dewpoint850C: 10,
  temperature500C: -10,
} satisfies Input;
export const exampleOutput = {
  verticalTotalsC: 30,
  crossTotalsC: 20,
  totalTotalsC: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/total-totals-index",
  title: "Total Totals Index",
  description:
    "Resolve named vertical/cross/total totals from fixed 850/500-hPa observations; unlike K index, no 700-hPa moisture layer and no storm occurrence/safety classification.",
  inputs: inputFields,
  outputs: [
    { id: "verticalTotalsC", label: "Vertical totals c", kind: "number" },
    { id: "crossTotalsC", label: "Cross totals c", kind: "number" },
    { id: "totalTotalsC", label: "Total totals c", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      temperature850C: value.temperature850C as number,
      dewpoint850C: value.dewpoint850C as number,
      temperature500C: value.temperature500C as number,
    }),
});
export const run = tool.execute;
export default tool;
