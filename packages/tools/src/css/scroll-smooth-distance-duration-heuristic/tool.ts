import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  ordered,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedDistancePx: number;
  readonly callerPixelsPerSecond: number;
  readonly callerMinDurationSeconds: number;
  readonly callerMaxDurationSeconds: number;
}>;
export type Output = Readonly<{
  readonly callerHeuristicDurationSeconds: number;
}>;
const inputFields = [
  { id: "observedDistancePx", label: "Observed distance px", kind: "number" },
  {
    id: "callerPixelsPerSecond",
    label: "Caller pixels per second",
    kind: "number",
  },
  {
    id: "callerMinDurationSeconds",
    label: "Caller min duration seconds",
    kind: "number",
  },
  {
    id: "callerMaxDurationSeconds",
    label: "Caller max duration seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerPixelsPerSecond, "callerPixelsPerSecond");
  nonnegative(input.observedDistancePx, "observedDistancePx");
  nonnegative(input.callerMinDurationSeconds, "callerMinDurationSeconds");
  nonnegative(input.callerMaxDurationSeconds, "callerMaxDurationSeconds");
  ordered(input.callerMinDurationSeconds, input.callerMaxDurationSeconds);
  return {
    callerHeuristicDurationSeconds: Math.max(
      input.callerMinDurationSeconds,
      Math.min(
        input.callerMaxDurationSeconds,
        input.observedDistancePx / input.callerPixelsPerSecond,
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDistancePx: 1000,
  callerPixelsPerSecond: 2000,
  callerMinDurationSeconds: 0.1,
  callerMaxDurationSeconds: 1,
} satisfies Input;
export const exampleOutput = {
  callerHeuristicDurationSeconds: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/scroll-smooth-distance-duration-heuristic",
  title: "scroll-behavior Smooth Duration Heuristic",
  description:
    "Explicit caller smooth-scroll distance/speed/clamp heuristic, not CSS specification or browser smooth-scroll timing guarantee. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerHeuristicDurationSeconds",
      label: "Caller heuristic duration seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDistancePx: value.observedDistancePx as number,
      callerPixelsPerSecond: value.callerPixelsPerSecond as number,
      callerMinDurationSeconds: value.callerMinDurationSeconds as number,
      callerMaxDurationSeconds: value.callerMaxDurationSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
