import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ForwardConverterDutyCycleInput = {
  readonly vIn: number;
  readonly vOut: number;
  readonly turnsRatioNsNp: number;
};

export type ForwardConverterDutyCycleOutput = {
  readonly forwardDutyCyclePercent: number;
};

export const forwardConverterDutyCycleExample = {
  input: { vIn: 12, vOut: 5, turnsRatioNsNp: 0.5 },
  output: { forwardDutyCyclePercent: 83.33333333333334 },
} satisfies ToolExample<
  ForwardConverterDutyCycleInput,
  ForwardConverterDutyCycleOutput
>;

export const calculateForwardConverterDutyCycle = (
  input: ForwardConverterDutyCycleInput,
): ForwardConverterDutyCycleOutput => {
  if (!(input.vIn > 0))
    simpleError("vIn", "Input voltage must be positive.", "invalid_v_in");
  if (!(input.vOut > 0))
    simpleError("vOut", "Output voltage must be positive.", "invalid_v_out");
  if (!(input.turnsRatioNsNp > 0))
    simpleError(
      "turnsRatioNsNp",
      "Turns ratio must be positive.",
      "invalid_turns_ratio_ns_np",
    );
  const dutyCycle = input.vOut / (input.vIn * input.turnsRatioNsNp);
  if (!(dutyCycle <= 1))
    simpleError(
      "vOut",
      "The requested output requires a duty cycle above 100 percent.",
      "unattainable_conversion_ratio",
    );
  return { forwardDutyCyclePercent: dutyCycle * 100 };
};

export const forwardConverterDutyCycleTool = createSimpleTool({
  calculate: (input) =>
    calculateForwardConverterDutyCycle(
      input as unknown as ForwardConverterDutyCycleInput,
    ),
  description:
    "Compute the ideal forward-converter duty cycle as Vout / (Vin x Ns/Np) x 100 and reject unattainable ratios above 100 percent; the design's transformer-reset limit must be checked separately.",
  id: "electronics/forward-converter-duty-cycle",
  inputs: [
    { id: "vIn", kind: "number", label: "Input voltage", unit: "V" },
    { id: "vOut", kind: "number", label: "Output voltage", unit: "V" },
    {
      id: "turnsRatioNsNp",
      kind: "number",
      label: "Secondary-to-primary turns ratio",
    },
  ],
  outputs: [
    {
      id: "forwardDutyCyclePercent",
      kind: "number",
      label: "Duty cycle",
      unit: "%",
    },
  ],
  title: "Forward Duty Cycle",
});
export const runForwardConverterDutyCycle =
  forwardConverterDutyCycleTool.execute;
export default forwardConverterDutyCycleTool;
