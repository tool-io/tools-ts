import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThreePhaseApparentPowerInput = Readonly<{
  readonly lineVoltageVolts: number;
  readonly lineCurrentAmperes: number;
}>;
export type ThreePhaseApparentPowerOutput = Readonly<{
  readonly apparentVoltAmperes: number;
}>;

export const calculateThreePhaseApparentPower = (
  x: ThreePhaseApparentPowerInput,
): ThreePhaseApparentPowerOutput => {
  if (!Number.isFinite(x.lineVoltageVolts) || x.lineVoltageVolts < 0)
    simpleError("lineVoltageVolts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.lineCurrentAmperes) || x.lineCurrentAmperes < 0)
    simpleError("lineCurrentAmperes", "Provide a finite number at least 0.");
  const apparentVoltAmperes =
    Math.sqrt(3) * x.lineVoltageVolts * x.lineCurrentAmperes;
  if (!Number.isFinite(apparentVoltAmperes))
    simpleError(
      "apparentVoltAmperes",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    apparentVoltAmperes: Object.is(apparentVoltAmperes, -0)
      ? 0
      : apparentVoltAmperes,
  };
};

export const example = {
  input: { lineVoltageVolts: 400, lineCurrentAmperes: 10 },
  output: { apparentVoltAmperes: 6928.203230275509 },
} satisfies ToolExample<
  ThreePhaseApparentPowerInput,
  ThreePhaseApparentPowerOutput
>;

export const tool = createSimpleTool({
  id: "engineering/three-phase-apparent-power",
  title: "Three Phase Apparent Power",
  description:
    "Balanced three-phase apparent power √3 VLL I at line-to-line RMS voltage.",
  inputs: [
    {
      id: "lineVoltageVolts",
      kind: "number",
      label: "Line Voltage Volts",
      unit: "V",
      minimum: 0,
    },
    {
      id: "lineCurrentAmperes",
      kind: "number",
      label: "Line Current Amperes",
      unit: "A",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "apparentVoltAmperes",
      kind: "number",
      label: "Apparent Volt Amperes",
      unit: "VA",
    },
  ],
  calculate: (input) =>
    calculateThreePhaseApparentPower({
      lineVoltageVolts: input.lineVoltageVolts as number,
      lineCurrentAmperes: input.lineCurrentAmperes as number,
    }),
});
export const threePhaseApparentPowerTool = tool;
export const runThreePhaseApparentPower = tool.execute;
export default tool;
