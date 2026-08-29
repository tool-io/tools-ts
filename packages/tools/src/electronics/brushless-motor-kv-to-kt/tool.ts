import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BrushlessMotorKvToKtInput = Readonly<{
  readonly speedConstantRpmPerVolt: number;
}>;
export type BrushlessMotorKvToKtOutput = Readonly<{
  torqueConstantNmPerAmpere: number;
}>;

export const calculateBrushlessMotorKvToKt = (
  i: BrushlessMotorKvToKtInput,
): BrushlessMotorKvToKtOutput => {
  const denominator = 2 * Math.PI * i.speedConstantRpmPerVolt;
  const value = Number.isFinite(denominator)
    ? 60 / denominator
    : 60 / i.speedConstantRpmPerVolt / (2 * Math.PI);
  if (!Number.isFinite(value))
    simpleError(
      "torqueConstantNmPerAmpere",
      "The inputs produce a non-finite result.",
    );
  return { torqueConstantNmPerAmpere: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { speedConstantRpmPerVolt: 1000 },
  output: { torqueConstantNmPerAmpere: 0.009549296585513721 },
} satisfies ToolExample<BrushlessMotorKvToKtInput, BrushlessMotorKvToKtOutput>;

export const tool = createSimpleTool({
  id: "electronics/brushless-motor-kv-to-kt",
  title: "Brushless Motor Kv To Kt",
  description:
    "Convert a brushless motor speed constant in RPM per volt to ideal torque constant in newton-meters per ampere using 60/(2πKv); winding and measurement conventions must match.",
  inputs: [
    {
      id: "speedConstantRpmPerVolt",
      kind: "number",
      label: "Speed constant (rpm/V)",
      unit: "rpm/V",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "torqueConstantNmPerAmpere",
      kind: "number",
      label: "Torque Constant (N·m/A)",
      unit: "N·m/A",
    },
  ],
  calculate: (input) =>
    calculateBrushlessMotorKvToKt({
      speedConstantRpmPerVolt: input.speedConstantRpmPerVolt as number,
    }),
});
export const brushlessMotorKvToKtTool = tool;
export const runBrushlessMotorKvToKt = tool.execute;
export default tool;
