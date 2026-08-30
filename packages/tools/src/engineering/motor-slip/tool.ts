import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MotorSlipInput = Readonly<{
  readonly synchronousRpm: number;
  readonly rotorRpm: number;
}>;
export type MotorSlipOutput = Readonly<{
  readonly slipPercent: number;
}>;

export const calculateMotorSlip = (x: MotorSlipInput): MotorSlipOutput => {
  if (!Number.isFinite(x.synchronousRpm) || x.synchronousRpm < 0)
    simpleError("synchronousRpm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.rotorRpm) || x.rotorRpm < 0)
    simpleError("rotorRpm", "Provide a finite number at least 0.");
  if (x.rotorRpm > x.synchronousRpm)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const slipPercent =
    (100 * (x.synchronousRpm - x.rotorRpm)) / x.synchronousRpm;
  if (!Number.isFinite(slipPercent))
    simpleError(
      "slipPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { slipPercent: Object.is(slipPercent, -0) ? 0 : slipPercent };
};

export const example = {
  input: { synchronousRpm: 1500, rotorRpm: 1450 },
  output: { slipPercent: 3.3333333333333335 },
} satisfies ToolExample<MotorSlipInput, MotorSlipOutput>;

export const tool = createSimpleTool({
  id: "engineering/motor-slip",
  title: "Motor Slip",
  description:
    "Induction motor slip percentage from synchronous speed and observed rotor speed.",
  inputs: [
    {
      id: "synchronousRpm",
      kind: "number",
      label: "Synchronous Rpm",
      unit: "rpm",
      minimum: 0,
    },
    {
      id: "rotorRpm",
      kind: "number",
      label: "Rotor Rpm",
      unit: "rpm",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "slipPercent", kind: "number", label: "Slip Percent", unit: "%" },
  ],
  calculate: (input) =>
    calculateMotorSlip({
      synchronousRpm: input.synchronousRpm as number,
      rotorRpm: input.rotorRpm as number,
    }),
});
export const motorSlipTool = tool;
export const runMotorSlip = tool.execute;
export default tool;
