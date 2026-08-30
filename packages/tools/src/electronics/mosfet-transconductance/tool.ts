import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MosfetTransconductanceInput = Readonly<{
  readonly drainCurrentA: number;
  readonly overdriveVoltageV: number;
}>;
export type MosfetTransconductanceOutput = Readonly<{
  readonly transconductanceS: number;
}>;

export const calculateMosfetTransconductance = (
  x: MosfetTransconductanceInput,
): MosfetTransconductanceOutput => {
  if (!Number.isFinite(x.drainCurrentA) || x.drainCurrentA < 0)
    simpleError("drainCurrentA", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.overdriveVoltageV) || x.overdriveVoltageV < 0)
    simpleError("overdriveVoltageV", "Provide a finite number at least 0.");
  if (!(x.overdriveVoltageV > 0))
    simpleError("overdriveVoltageV", "Overdrive must be positive.");
  const transconductanceS = (2 * x.drainCurrentA) / x.overdriveVoltageV;
  if (!Number.isFinite(transconductanceS))
    simpleError("transconductanceS", "The inputs produce an invalid result.");
  return {
    transconductanceS: Object.is(transconductanceS, -0) ? 0 : transconductanceS,
  };
};

export const example = {
  input: { drainCurrentA: 0.002, overdriveVoltageV: 0.2 },
  output: { transconductanceS: 0.02 },
} satisfies ToolExample<
  MosfetTransconductanceInput,
  MosfetTransconductanceOutput
>;

export const tool = createSimpleTool({
  id: "electronics/mosfet-transconductance",
  title: "MOSFET Transconductance",
  description:
    "Estimate long-channel saturated MOSFET small-signal transconductance from drain current and gate overdrive, neglecting channel-length modulation.",
  inputs: [
    {
      id: "drainCurrentA",
      kind: "number",
      label: "Drain current",
      unit: "A",
      minimum: 0,
    },
    {
      id: "overdriveVoltageV",
      kind: "number",
      label: "Gate overdrive",
      unit: "V",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "transconductanceS",
      kind: "number",
      label: "Transconductance",
      unit: "S",
    },
  ],
  calculate: (input) =>
    calculateMosfetTransconductance({
      drainCurrentA: input.drainCurrentA as number,
      overdriveVoltageV: input.overdriveVoltageV as number,
    }),
});
export const mosfetTransconductanceTool = tool;
export const runMosfetTransconductance = tool.execute;
export default tool;
