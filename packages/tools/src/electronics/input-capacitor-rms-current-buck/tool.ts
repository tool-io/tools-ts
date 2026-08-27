import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InputCapacitorRmsCurrentBuckInput = {
  readonly dutyFraction: number;
  readonly iOutA: number;
};

export type InputCapacitorRmsCurrentBuckOutput = {
  readonly inputCapacitorRmsA: number;
};

export const inputCapacitorRmsCurrentBuckExample = {
  input: { dutyFraction: 0.5, iOutA: 2 },
  output: { inputCapacitorRmsA: 1 },
} satisfies ToolExample<
  InputCapacitorRmsCurrentBuckInput,
  InputCapacitorRmsCurrentBuckOutput
>;

export const calculateInputCapacitorRmsCurrentBuck = (
  input: InputCapacitorRmsCurrentBuckInput,
): InputCapacitorRmsCurrentBuckOutput => {
  if (!(input.iOutA > 0))
    simpleError("iOutA", "Output current must be positive.", "invalid_current");
  if (!(input.dutyFraction >= 0) || !(input.dutyFraction <= 1))
    simpleError(
      "dutyFraction",
      "Duty fraction must lie between zero and one.",
      "invalid_duty",
    );
  return {
    inputCapacitorRmsA:
      input.iOutA * Math.sqrt(input.dutyFraction * (1 - input.dutyFraction)),
  };
};

export const inputCapacitorRmsCurrentBuckTool = createSimpleTool({
  calculate: (input) =>
    calculateInputCapacitorRmsCurrentBuck(
      input as unknown as InputCapacitorRmsCurrentBuckInput,
    ),
  description:
    "Compute buck converter input capacitor rms current as Iout x sqrt(D x (1 - D)).",
  id: "electronics/input-capacitor-rms-current-buck",
  inputs: [
    {
      id: "dutyFraction",
      kind: "number",
      label: "Duty cycle",
      maximum: 1,
      minimum: 0,
    },
    { id: "iOutA", kind: "number", label: "Output current", unit: "A" },
  ],
  outputs: [
    {
      id: "inputCapacitorRmsA",
      kind: "number",
      label: "Input capacitor RMS current",
      unit: "A",
    },
  ],
  title: "Input Cap RMS Current",
});
export const runInputCapacitorRmsCurrentBuck =
  inputCapacitorRmsCurrentBuckTool.execute;
export default inputCapacitorRmsCurrentBuckTool;
