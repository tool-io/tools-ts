import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CreepSteadyRateInput = Readonly<{
  readonly strainChange: number;
  readonly elapsedHours: number;
}>;
export type CreepSteadyRateOutput = Readonly<{
  readonly strainPerHour: number;
}>;

export const calculateCreepSteadyRate = (
  x: CreepSteadyRateInput,
): CreepSteadyRateOutput => {
  if (!Number.isFinite(x.strainChange))
    simpleError("strainChange", "Provide a finite number.");
  if (!Number.isFinite(x.elapsedHours) || x.elapsedHours < 0)
    simpleError("elapsedHours", "Provide a finite number at least 0.");
  const strainPerHour = x.strainChange / x.elapsedHours;
  if (!Number.isFinite(strainPerHour))
    simpleError(
      "strainPerHour",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { strainPerHour: Object.is(strainPerHour, -0) ? 0 : strainPerHour };
};

export const example = {
  input: { strainChange: 0.02, elapsedHours: 100 },
  output: { strainPerHour: 0.0002 },
} satisfies ToolExample<CreepSteadyRateInput, CreepSteadyRateOutput>;

export const tool = createSimpleTool({
  id: "engineering/creep-steady-rate",
  title: "Creep Steady Rate",
  description:
    "Steady creep strain rate from measured strain change divided by elapsed time.",
  inputs: [
    { id: "strainChange", kind: "number", label: "Strain Change" },
    {
      id: "elapsedHours",
      kind: "number",
      label: "Elapsed Hours",
      unit: "h",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "strainPerHour",
      kind: "number",
      label: "Strain Per Hour",
      unit: "1/h",
    },
  ],
  calculate: (input) =>
    calculateCreepSteadyRate({
      strainChange: input.strainChange as number,
      elapsedHours: input.elapsedHours as number,
    }),
});
export const creepSteadyRateTool = tool;
export const runCreepSteadyRate = tool.execute;
export default tool;
