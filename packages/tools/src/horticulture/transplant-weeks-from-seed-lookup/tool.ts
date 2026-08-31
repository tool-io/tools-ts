import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  dateDay,
  dayDate,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly actualSowingCivilDate: string;
  readonly callerVerifiedMinimumSeedToTransplantDays: number;
  readonly callerVerifiedMaximumSeedToTransplantDays: number;
  readonly plannedTransplantCivilDate: string;
}>;
export type Output = Readonly<{
  readonly callerTransplantWindowStartCivilDate: string;
  readonly callerTransplantWindowEndCivilDate: string;
  readonly plannedTransplantWithinCallerWindow: boolean;
}>;
const inputFields = [
  {
    id: "actualSowingCivilDate",
    label: "Actual sowing civil date",
    kind: "string",
  },
  {
    id: "callerVerifiedMinimumSeedToTransplantDays",
    label: "Caller verified minimum seed to transplant days",
    kind: "number",
  },
  {
    id: "callerVerifiedMaximumSeedToTransplantDays",
    label: "Caller verified maximum seed to transplant days",
    kind: "number",
  },
  {
    id: "plannedTransplantCivilDate",
    label: "Planned transplant civil date",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.callerVerifiedMinimumSeedToTransplantDays, "minimum", 0, 366);
  bounded(
    input.callerVerifiedMaximumSeedToTransplantDays,
    "maximum",
    input.callerVerifiedMinimumSeedToTransplantDays,
    366,
  );
  const start = dateDay(input.actualSowingCivilDate),
    planned = dateDay(input.plannedTransplantCivilDate),
    lo = start + input.callerVerifiedMinimumSeedToTransplantDays,
    hi = start + input.callerVerifiedMaximumSeedToTransplantDays;
  return {
    callerTransplantWindowStartCivilDate: dayDate(lo),
    callerTransplantWindowEndCivilDate: dayDate(hi),
    plannedTransplantWithinCallerWindow: planned >= lo && planned <= hi,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  actualSowingCivilDate: "2026-04-01",
  callerVerifiedMinimumSeedToTransplantDays: 21,
  callerVerifiedMaximumSeedToTransplantDays: 28,
  plannedTransplantCivilDate: "2026-04-25",
} satisfies Input;
export const exampleOutput = {
  callerTransplantWindowStartCivilDate: "2026-04-22",
  callerTransplantWindowEndCivilDate: "2026-04-29",
  plannedTransplantWithinCallerWindow: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/transplant-weeks-from-seed-lookup",
  title: "Transplant Weeks From Seed Lookup",
  description:
    "Audit actual sowing/planned transplant civil dates against independently verified caller stage duration window; no universal weeks, phenological readiness, time-zone or business-day inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerTransplantWindowStartCivilDate",
      label: "Caller transplant window start civil date",
      kind: "string",
    },
    {
      id: "callerTransplantWindowEndCivilDate",
      label: "Caller transplant window end civil date",
      kind: "string",
    },
    {
      id: "plannedTransplantWithinCallerWindow",
      label: "Planned transplant within caller window",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      actualSowingCivilDate: value.actualSowingCivilDate as string,
      callerVerifiedMinimumSeedToTransplantDays:
        value.callerVerifiedMinimumSeedToTransplantDays as number,
      callerVerifiedMaximumSeedToTransplantDays:
        value.callerVerifiedMaximumSeedToTransplantDays as number,
      plannedTransplantCivilDate: value.plannedTransplantCivilDate as string,
    }),
});
export const run = tool.execute;
export default tool;
