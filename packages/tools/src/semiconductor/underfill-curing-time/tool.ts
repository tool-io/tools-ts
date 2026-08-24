import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UnderfillCuringTimeInput = {
  readonly cureTempC: number;
  readonly q10Factor?: number;
  readonly referenceMinutes: number;
  readonly referenceTempC: number;
};

export type UnderfillCuringTimeOutput = {
  readonly cureMinutes: number;
};

export const underfillCuringTimeExample = {
  input: { cureTempC: 130, referenceMinutes: 60, referenceTempC: 150 },
  output: { cureMinutes: 240 },
} satisfies ToolExample<UnderfillCuringTimeInput, UnderfillCuringTimeOutput>;

export const underfillCuringTimeTool = createSimpleTool({
  calculate: (input) => {
    const referenceMinutes = input.referenceMinutes as number;
    const q10Factor = input.q10Factor as number;
    if (!(referenceMinutes > 0))
      simpleError("referenceMinutes", "Reference time must be positive.");
    if (!(q10Factor > 0))
      simpleError("q10Factor", "Q10 factor must be positive.");
    if (!((input.referenceTempC as number) >= -273.15))
      simpleError(
        "referenceTempC",
        "Reference temperature cannot be below absolute zero.",
      );
    const cureMinutes =
      referenceMinutes *
      Math.pow(
        q10Factor,
        ((input.referenceTempC as number) - (input.cureTempC as number)) / 10,
      );
    if (!Number.isFinite(cureMinutes))
      simpleError(
        "cureTempC",
        "Calculated cure time is not finite.",
        "result_overflow",
      );
    return { cureMinutes };
  },
  description:
    "Scale an underfill reference cure time to a target temperature using a documented heuristic that doubles the cure time for every 10 degrees Celsius below the reference.",
  id: "semiconductor/underfill-curing-time",
  inputs: [
    {
      description: "Target curing temperature.",
      id: "cureTempC",
      kind: "number",
      label: "Cure temperature",
      minimum: -273.15,
      unit: "°C",
    },
    {
      description: "Cure duration at the reference temperature.",
      id: "referenceMinutes",
      kind: "number",
      label: "Reference time",
      unit: "min",
    },
    {
      description: "Temperature the reference duration was measured at.",
      id: "referenceTempC",
      kind: "number",
      label: "Reference temperature",
      unit: "°C",
    },
    {
      default: 2,
      description: "Multiplicative time change for each 10 °C decrease.",
      id: "q10Factor",
      kind: "number",
      label: "Q10 factor",
    },
  ],
  outputs: [
    {
      description: "Estimated cure duration at the target temperature.",
      id: "cureMinutes",
      kind: "number",
      label: "Cure time",
      unit: "min",
    },
  ],
  title: "Underfill Cure Time Calculator",
});
export const runUnderfillCuringTime = underfillCuringTimeTool.execute;
export default underfillCuringTimeTool;
