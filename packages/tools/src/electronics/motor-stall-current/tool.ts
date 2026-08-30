import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MotorStallCurrentInput = Readonly<{
  readonly voltageVolts: number;
  readonly armatureResistanceOhms: number;
}>;
export type MotorStallCurrentOutput = Readonly<{
  readonly stallAmperes: number;
}>;

export const calculateMotorStallCurrent = (
  x: MotorStallCurrentInput,
): MotorStallCurrentOutput => {
  if (!Number.isFinite(x.voltageVolts) || x.voltageVolts < 0)
    simpleError("voltageVolts", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.armatureResistanceOhms) ||
    x.armatureResistanceOhms < 0
  )
    simpleError(
      "armatureResistanceOhms",
      "Provide a finite number at least 0.",
    );
  const stallAmperes = x.voltageVolts / x.armatureResistanceOhms;
  if (!Number.isFinite(stallAmperes))
    simpleError(
      "stallAmperes",
      "Inputs produce an undefined or non-finite result.",
    );
  return { stallAmperes: Object.is(stallAmperes, -0) ? 0 : stallAmperes };
};

export const example = {
  input: { voltageVolts: 12, armatureResistanceOhms: 2 },
  output: { stallAmperes: 6 },
} satisfies ToolExample<MotorStallCurrentInput, MotorStallCurrentOutput>;

export const tool = createSimpleTool({
  id: "electronics/motor-stall-current",
  title: "Motor Stall Current",
  description:
    "Approximate DC motor stall current from applied voltage and armature resistance, neglecting brush and supply losses.",
  inputs: [
    {
      id: "voltageVolts",
      kind: "number",
      label: "Voltage Volts",
      unit: "V",
      minimum: 0,
    },
    {
      id: "armatureResistanceOhms",
      kind: "number",
      label: "Armature Resistance Ohms",
      unit: "Ω",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "stallAmperes", kind: "number", label: "Stall Amperes", unit: "A" },
  ],
  calculate: (input) =>
    calculateMotorStallCurrent({
      voltageVolts: input.voltageVolts as number,
      armatureResistanceOhms: input.armatureResistanceOhms as number,
    }),
});
export const motorStallCurrentTool = tool;
export const runMotorStallCurrent = tool.execute;
export default tool;
