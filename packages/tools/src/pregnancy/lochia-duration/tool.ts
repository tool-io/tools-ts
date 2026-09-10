import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  daysBetween,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyRecordedLochiaStartDate: string;
  readonly independentlyRecordedLochiaEndDate: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyRecordedLochiaStartDate",
    label: "Independently recorded lochia start date",
    kind: "string",
  },
  {
    id: "independentlyRecordedLochiaEndDate",
    label: "Independently recorded lochia end date",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const d = daysBetween(
    input.independentlyRecordedLochiaStartDate,
    input.independentlyRecordedLochiaEndDate,
  );
  nonnegative(d, "elapsed");
  return { observedElapsedLochiaDays: d };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyRecordedLochiaStartDate: "2026-01-01",
    independentlyRecordedLochiaEndDate: "2026-01-15",
  },
  output: { result: { observedElapsedLochiaDays: 14 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/lochia-duration",
  title: "Lochia Duration Calculator",
  description:
    "Actual elapsed start/end lochia calendar days, not expected duration, normal bleeding, treatment or permission to defer assessment of symptoms.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
