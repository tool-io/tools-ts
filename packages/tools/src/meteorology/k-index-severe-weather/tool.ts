import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../shared.js";

export type Input = Readonly<{
  readonly temperature850C: number;
  readonly temperature700C: number;
  readonly temperature500C: number;
  readonly dewpoint850C: number;
  readonly dewpoint700C: number;
}>;
export type Output = Readonly<{ readonly kIndexC: number }>;
const inputFields = [
  { id: "temperature850C", label: "Temperature850 c", kind: "number" },
  { id: "temperature700C", label: "Temperature700 c", kind: "number" },
  { id: "temperature500C", label: "Temperature500 c", kind: "number" },
  { id: "dewpoint850C", label: "Dewpoint850 c", kind: "number" },
  { id: "dewpoint700C", label: "Dewpoint700 c", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.dewpoint850C > input.temperature850C ||
    input.dewpoint700C > input.temperature700C
  )
    simpleError(
      "dewpoints",
      "Dewpoint at or below temperature required at each sampled level.",
    );
  return {
    kIndexC:
      input.temperature850C -
      input.temperature500C +
      input.dewpoint850C -
      (input.temperature700C - input.dewpoint700C),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  temperature850C: 20,
  temperature700C: 10,
  temperature500C: -10,
  dewpoint850C: 15,
  dewpoint700C: 5,
} satisfies Input;
export const exampleOutput = { kIndexC: 40 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/k-index-severe-weather",
  title: "K Index Severe Weather",
  description:
    "Calculate named K index from 850/700/500-hPa temperature and measured 850/700 dewpoints; input levels must match and no severe-weather probability/recommendation follows.",
  inputs: inputFields,
  outputs: [{ id: "kIndexC", label: "K index c", kind: "number" }],
  calculate: (value) =>
    calculate({
      temperature850C: value.temperature850C as number,
      temperature700C: value.temperature700C as number,
      temperature500C: value.temperature500C as number,
      dewpoint850C: value.dewpoint850C as number,
      dewpoint700C: value.dewpoint700C as number,
    }),
});
export const run = tool.execute;
export default tool;
