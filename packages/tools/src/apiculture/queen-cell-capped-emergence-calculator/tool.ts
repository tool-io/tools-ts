import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  ordered,
  dayOffset,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedQueenCellCappingDate: string;
  readonly callerMatchedMinimumRemainingDays: number;
  readonly callerMatchedMaximumRemainingDays: number;
}>;
export type Output = Readonly<{
  readonly callerEarliestEmergenceDate: string;
  readonly callerLatestEmergenceDate: string;
}>;
const inputFields = [
  {
    id: "observedQueenCellCappingDate",
    label: "Observed queen cell capping date",
    kind: "string",
  },
  {
    id: "callerMatchedMinimumRemainingDays",
    label: "Caller matched minimum remaining days",
    kind: "number",
  },
  {
    id: "callerMatchedMaximumRemainingDays",
    label: "Caller matched maximum remaining days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.callerMatchedMinimumRemainingDays, "minimum", 0, 100);
  bounded(input.callerMatchedMaximumRemainingDays, "maximum", 0, 100);
  ordered(
    input.callerMatchedMinimumRemainingDays,
    input.callerMatchedMaximumRemainingDays,
  );
  return {
    callerEarliestEmergenceDate: dayOffset(
      input.observedQueenCellCappingDate,
      input.callerMatchedMinimumRemainingDays,
    ),
    callerLatestEmergenceDate: dayOffset(
      input.observedQueenCellCappingDate,
      input.callerMatchedMaximumRemainingDays,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedQueenCellCappingDate: "2026-05-01",
  callerMatchedMinimumRemainingDays: 5,
  callerMatchedMaximumRemainingDays: 8,
} satisfies Input;
export const exampleOutput = {
  callerEarliestEmergenceDate: "2026-05-06",
  callerLatestEmergenceDate: "2026-05-09",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/queen-cell-capped-emergence-calculator",
  title: "Queen Cell Capped Emergence Date Calculator",
  description:
    "Scenario emergence window from actual independently confirmed queen-cell capping and same-strain/protocol remaining durations, not fixed natural emergence prediction. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerEarliestEmergenceDate",
      label: "Caller earliest emergence date",
      kind: "string",
    },
    {
      id: "callerLatestEmergenceDate",
      label: "Caller latest emergence date",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      observedQueenCellCappingDate:
        value.observedQueenCellCappingDate as string,
      callerMatchedMinimumRemainingDays:
        value.callerMatchedMinimumRemainingDays as number,
      callerMatchedMaximumRemainingDays:
        value.callerMatchedMaximumRemainingDays as number,
    }),
});
export const run = tool.execute;
export default tool;
