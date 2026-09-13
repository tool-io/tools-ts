import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualPerRefreshEmissionMilliseconds: number;
  readonly actualMeasuredDisplayRefreshHz: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualPerRefreshEmissionMilliseconds",
    label: "Actual per refresh emission milliseconds",
    kind: "number",
  },
  {
    id: "actualMeasuredDisplayRefreshHz",
    label: "Actual measured display refresh hz",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualPerRefreshEmissionMilliseconds,
    "actualPerRefreshEmissionMilliseconds",
  );
  positive(
    input.actualMeasuredDisplayRefreshHz,
    "actualMeasuredDisplayRefreshHz",
  );
  if (
    input.actualPerRefreshEmissionMilliseconds *
      input.actualMeasuredDisplayRefreshHz >
    1000
  )
    simpleError("duty", "Actualemissionwithinrefreshperiod.");
  return {
    value:
      (input.actualPerRefreshEmissionMilliseconds *
        input.actualMeasuredDisplayRefreshHz) /
      1000,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualPerRefreshEmissionMilliseconds: 5,
    actualMeasuredDisplayRefreshHz: 100,
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/low-persistence-duty-cycle",
  title: "Low Persistence Duty Cycle Calculator",
  description:
    "Actual emission duty=persistence_ms\u00d7Hz/1000, in[0,1], not global display duty/power forecast.",
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
