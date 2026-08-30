import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TouchCapacitanceDeltaInput = Readonly<{
  readonly baselineCapacitancePf: number;
  readonly measuredCapacitancePf: number;
}>;
export type TouchCapacitanceDeltaOutput = Readonly<{
  readonly capacitanceDeltaPf: number;
}>;

export const calculateTouchCapacitanceDelta = (
  x: TouchCapacitanceDeltaInput,
): TouchCapacitanceDeltaOutput => {
  if (!Number.isFinite(x.baselineCapacitancePf) || x.baselineCapacitancePf < 0)
    simpleError("baselineCapacitancePf", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.measuredCapacitancePf) || x.measuredCapacitancePf < 0)
    simpleError("measuredCapacitancePf", "Provide a finite number at least 0.");
  const capacitanceDeltaPf = x.measuredCapacitancePf - x.baselineCapacitancePf;
  if (!Number.isFinite(capacitanceDeltaPf))
    simpleError("capacitanceDeltaPf", "The inputs produce an invalid result.");
  return {
    capacitanceDeltaPf: Object.is(capacitanceDeltaPf, -0)
      ? 0
      : capacitanceDeltaPf,
  };
};

export const example = {
  input: { baselineCapacitancePf: 20, measuredCapacitancePf: 23 },
  output: { capacitanceDeltaPf: 3 },
} satisfies ToolExample<
  TouchCapacitanceDeltaInput,
  TouchCapacitanceDeltaOutput
>;

export const tool = createSimpleTool({
  id: "electronics/touch-capacitance-delta",
  title: "Touch Capacitance Delta",
  description:
    "Subtract baseline touch-electrode capacitance from measured capacitance; the signed delta distinguishes increases from decreases.",
  inputs: [
    {
      id: "baselineCapacitancePf",
      kind: "number",
      label: "Baseline capacitance",
      unit: "pF",
      minimum: 0,
    },
    {
      id: "measuredCapacitancePf",
      kind: "number",
      label: "Measured capacitance",
      unit: "pF",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "capacitanceDeltaPf",
      kind: "number",
      label: "Touch capacitance change",
      unit: "pF",
    },
  ],
  calculate: (input) =>
    calculateTouchCapacitanceDelta({
      baselineCapacitancePf: input.baselineCapacitancePf as number,
      measuredCapacitancePf: input.measuredCapacitancePf as number,
    }),
});
export const touchCapacitanceDeltaTool = tool;
export const runTouchCapacitanceDelta = tool.execute;
export default tool;
