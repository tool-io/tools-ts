import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MotorStartingCurrentInput = Readonly<{
  readonly armatureVoltageV: number;
  readonly armatureResistanceOhms: number;
}>;
export type MotorStartingCurrentOutput = Readonly<{
  startingCurrentAmperes: number;
}>;

export const calculateMotorStartingCurrent = (
  i: MotorStartingCurrentInput,
): MotorStartingCurrentOutput => {
  const value = i.armatureVoltageV / i.armatureResistanceOhms;
  if (!Number.isFinite(value))
    simpleError(
      "startingCurrentAmperes",
      "The inputs produce a non-finite result.",
    );
  return { startingCurrentAmperes: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { armatureVoltageV: 24, armatureResistanceOhms: 1.2 },
  output: { startingCurrentAmperes: 20 },
} satisfies ToolExample<MotorStartingCurrentInput, MotorStartingCurrentOutput>;

export const tool = createSimpleTool({
  id: "electronics/motor-starting-current",
  title: "Motor Starting Current",
  description:
    "Estimate DC motor current at startup as applied armature voltage divided by winding resistance, before back EMF develops; drive current limiting is excluded.",
  inputs: [
    {
      id: "armatureVoltageV",
      kind: "number",
      label: "Armature (V)",
      unit: "V",
      minimum: 0,
    },
    {
      id: "armatureResistanceOhms",
      kind: "number",
      label: "Armature Resistance (Ω)",
      unit: "Ω",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "startingCurrentAmperes",
      kind: "number",
      label: "Starting Current (A)",
      unit: "A",
    },
  ],
  calculate: (input) =>
    calculateMotorStartingCurrent({
      armatureVoltageV: input.armatureVoltageV as number,
      armatureResistanceOhms: input.armatureResistanceOhms as number,
    }),
});
export const motorStartingCurrentTool = tool;
export const runMotorStartingCurrent = tool.execute;
export default tool;
