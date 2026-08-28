import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SepicDutyCycleInput = {
  readonly vIn: number;
  readonly vOut: number;
};

export type SepicDutyCycleOutput = {
  readonly sepicDutyCyclePercent: number;
};

export const sepicDutyCycleExample = {
  input: { vIn: 12, vOut: 5 },
  output: { sepicDutyCyclePercent: 29.411764705882355 },
} satisfies ToolExample<SepicDutyCycleInput, SepicDutyCycleOutput>;

export const calculateSepicDutyCycle = (
  input: SepicDutyCycleInput,
): SepicDutyCycleOutput => {
  if (!(input.vIn > 0))
    simpleError("vIn", "Input voltage must be positive.", "invalid_v_in");
  if (!(input.vOut > 0))
    simpleError("vOut", "Output voltage must be positive.", "invalid_v_out");
  return {
    sepicDutyCyclePercent: (input.vOut / (input.vIn + input.vOut)) * 100,
  };
};

export const sepicDutyCycleTool = createSimpleTool({
  calculate: (input) =>
    calculateSepicDutyCycle(input as unknown as SepicDutyCycleInput),
  description:
    "Compute the ideal continuous-conduction SEPIC duty cycle as Vout / (Vin + Vout) x 100.",
  id: "electronics/sepic-duty-cycle",
  inputs: [
    { id: "vIn", kind: "number", label: "Input voltage", unit: "V" },
    { id: "vOut", kind: "number", label: "Output voltage", unit: "V" },
  ],
  outputs: [
    {
      id: "sepicDutyCyclePercent",
      kind: "number",
      label: "Duty cycle",
      unit: "%",
    },
  ],
  title: "SEPIC Duty",
});
export const runSepicDutyCycle = sepicDutyCycleTool.execute;
export default sepicDutyCycleTool;
