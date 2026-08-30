import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HeadphoneImpedanceInput = Readonly<{
  readonly voltageRmsV: number;
  readonly currentRmsA: number;
}>;
export type HeadphoneImpedanceOutput = Readonly<{
  readonly impedanceMagnitudeOhm: number;
}>;

export const calculateHeadphoneImpedance = (
  x: HeadphoneImpedanceInput,
): HeadphoneImpedanceOutput => {
  if (!Number.isFinite(x.voltageRmsV) || x.voltageRmsV < 0)
    simpleError("voltageRmsV", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.currentRmsA) || x.currentRmsA < 0)
    simpleError("currentRmsA", "Provide a finite number at least 0.");
  if (!(x.currentRmsA > 0))
    simpleError("currentRmsA", "RMS current must be positive.");
  const impedanceMagnitudeOhm = x.voltageRmsV / x.currentRmsA;
  if (!Number.isFinite(impedanceMagnitudeOhm))
    simpleError(
      "impedanceMagnitudeOhm",
      "The inputs produce an invalid result.",
    );
  return {
    impedanceMagnitudeOhm: Object.is(impedanceMagnitudeOhm, -0)
      ? 0
      : impedanceMagnitudeOhm,
  };
};

export const example = {
  input: { voltageRmsV: 1, currentRmsA: 0.03125 },
  output: { impedanceMagnitudeOhm: 32 },
} satisfies ToolExample<HeadphoneImpedanceInput, HeadphoneImpedanceOutput>;

export const tool = createSimpleTool({
  id: "electronics/headphone-impedance",
  title: "Headphone Impedance",
  description:
    "Calculate headphone impedance magnitude at a test frequency from RMS terminal voltage and RMS current; phase is not determined.",
  inputs: [
    {
      id: "voltageRmsV",
      kind: "number",
      label: "Terminal RMS voltage",
      unit: "V",
      minimum: 0,
    },
    {
      id: "currentRmsA",
      kind: "number",
      label: "Terminal RMS current",
      unit: "A",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "impedanceMagnitudeOhm",
      kind: "number",
      label: "Impedance magnitude",
      unit: "Ω",
    },
  ],
  calculate: (input) =>
    calculateHeadphoneImpedance({
      voltageRmsV: input.voltageRmsV as number,
      currentRmsA: input.currentRmsA as number,
    }),
});
export const headphoneImpedanceTool = tool;
export const runHeadphoneImpedance = tool.execute;
export default tool;
