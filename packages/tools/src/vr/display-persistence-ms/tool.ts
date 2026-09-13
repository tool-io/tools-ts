import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualPixelEmittingDutyFraction: number;
  readonly actualMeasuredDisplayRefreshHz: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualPixelEmittingDutyFraction",
    label: "Actual pixel emitting duty fraction",
    kind: "number",
  },
  {
    id: "actualMeasuredDisplayRefreshHz",
    label: "Actual measured display refresh hz",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  fraction(
    input.actualPixelEmittingDutyFraction,
    "actualPixelEmittingDutyFraction",
  );
  positive(
    input.actualMeasuredDisplayRefreshHz,
    "actualMeasuredDisplayRefreshHz",
  );
  return {
    value:
      (1000 * input.actualPixelEmittingDutyFraction) /
      input.actualMeasuredDisplayRefreshHz,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualPixelEmittingDutyFraction: 0.5,
    actualMeasuredDisplayRefreshHz: 100,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/display-persistence-ms",
  title: "Display Persistence ms Calculator",
  description:
    "Actualperrefreshpositiveemissiondurationms=1000duty/Hz, not liquid crystal response/ghostingtime or eye strain.",
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
