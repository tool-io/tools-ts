import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, positive } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyRecordedMovementCount: number;
  readonly actualObservationMinutes: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyRecordedMovementCount",
    label: "Independently recorded movement count",
    kind: "number",
  },
  {
    id: "actualObservationMinutes",
    label: "Actual observation minutes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.independentlyRecordedMovementCount, "count", 0, 1000000);
  positive(input.actualObservationMinutes, "minutes");
  return {
    observedMovementsPerHour:
      (60 * input.independentlyRecordedMovementCount) /
      input.actualObservationMinutes,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyRecordedMovementCount: 10,
    actualObservationMinutes: 30,
  },
  output: { result: { observedMovementsPerHour: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/kick-count-per-hour",
  title: "Kick Count Per Hour Calculator",
  description:
    "Actual observed movement count normalized by recorded observation time. Not a universal kick threshold, continuous unobserved hourly count or clinical reassurance; concerns need appropriate clinical contact.",
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
