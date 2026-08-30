import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RegulatorIndexRateChangeInput = Readonly<{
  readonly indexMovement: number;
  readonly sensitivitySecondsPerDayPerUnit: number;
}>;
export type RegulatorIndexRateChangeOutput = Readonly<{
  readonly changeSecondsPerDay: number;
}>;

export const calculateRegulatorIndexRateChange = (
  x: RegulatorIndexRateChangeInput,
): RegulatorIndexRateChangeOutput => {
  if (!Number.isFinite(x.indexMovement))
    simpleError("indexMovement", "Provide a finite number.");
  if (!Number.isFinite(x.sensitivitySecondsPerDayPerUnit))
    simpleError("sensitivitySecondsPerDayPerUnit", "Provide a finite number.");
  const changeSecondsPerDay =
    x.indexMovement * x.sensitivitySecondsPerDayPerUnit;
  if (!Number.isFinite(changeSecondsPerDay))
    simpleError(
      "changeSecondsPerDay",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    changeSecondsPerDay: Object.is(changeSecondsPerDay, -0)
      ? 0
      : changeSecondsPerDay,
  };
};

export const example = {
  input: {
    indexMovement: 2,
    sensitivitySecondsPerDayPerUnit: 3,
  },
  output: { changeSecondsPerDay: 6 },
} satisfies ToolExample<
  RegulatorIndexRateChangeInput,
  RegulatorIndexRateChangeOutput
>;

export const tool = createSimpleTool({
  id: "horology/regulator-index-rate-change",
  title: "Regulator Index Rate Change",
  description:
    "Predicted signed daily-rate change from index movement and measured sensitivity in seconds per day per index unit.",
  inputs: [
    { id: "indexMovement", kind: "number", label: "Index Movement" },
    {
      id: "sensitivitySecondsPerDayPerUnit",
      kind: "number",
      label: "Sensitivity Seconds Per Day Per Unit",
      unit: "s/day/unit",
    },
  ],
  outputs: [
    {
      id: "changeSecondsPerDay",
      kind: "number",
      label: "Change Seconds Per Day",
      unit: "s/day",
    },
  ],
  calculate: (input) =>
    calculateRegulatorIndexRateChange({
      indexMovement: input.indexMovement as number,
      sensitivitySecondsPerDayPerUnit:
        input.sensitivitySecondsPerDayPerUnit as number,
    }),
});
export const regulatorIndexRateChangeTool = tool;
export const runRegulatorIndexRateChange = tool.execute;
export default tool;
