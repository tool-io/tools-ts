import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrystalDriveLevelInput = Readonly<{
  readonly motionalCurrentRmsA: number;
  readonly seriesResistanceOhm: number;
}>;
export type CrystalDriveLevelOutput = Readonly<{
  readonly drivePowerW: number;
}>;

export const calculateCrystalDriveLevel = (
  x: CrystalDriveLevelInput,
): CrystalDriveLevelOutput => {
  if (!Number.isFinite(x.motionalCurrentRmsA) || x.motionalCurrentRmsA < 0)
    simpleError("motionalCurrentRmsA", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.seriesResistanceOhm) || x.seriesResistanceOhm < 0)
    simpleError("seriesResistanceOhm", "Provide a finite number at least 0.");
  const drivePowerW = x.motionalCurrentRmsA ** 2 * x.seriesResistanceOhm;
  if (!Number.isFinite(drivePowerW))
    simpleError("drivePowerW", "The inputs produce an invalid result.");
  return { drivePowerW: Object.is(drivePowerW, -0) ? 0 : drivePowerW };
};

export const example = {
  input: { motionalCurrentRmsA: 0.0001, seriesResistanceOhm: 50 },
  output: { drivePowerW: 5e-7 },
} satisfies ToolExample<CrystalDriveLevelInput, CrystalDriveLevelOutput>;

export const tool = createSimpleTool({
  id: "electronics/crystal-drive-level",
  title: "Crystal Drive Level",
  description:
    "Compute crystal motional-branch dissipation from measured RMS motional current and motional series resistance.",
  inputs: [
    {
      id: "motionalCurrentRmsA",
      kind: "number",
      label: "Motional RMS current",
      unit: "A",
      minimum: 0,
    },
    {
      id: "seriesResistanceOhm",
      kind: "number",
      label: "Motional resistance",
      unit: "Ω",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "drivePowerW",
      kind: "number",
      label: "Crystal drive power",
      unit: "W",
    },
  ],
  calculate: (input) =>
    calculateCrystalDriveLevel({
      motionalCurrentRmsA: input.motionalCurrentRmsA as number,
      seriesResistanceOhm: input.seriesResistanceOhm as number,
    }),
});
export const crystalDriveLevelTool = tool;
export const runCrystalDriveLevel = tool.execute;
export default tool;
