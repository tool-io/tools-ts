import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AdcCodeToVoltageInput = Readonly<{
  readonly code: number;
  readonly resolutionBits: number;
  readonly referenceVolts: number;
}>;
export type AdcCodeToVoltageOutput = Readonly<{
  readonly inputVolts: number;
}>;

export const calculateAdcCodeToVoltage = (
  x: AdcCodeToVoltageInput,
): AdcCodeToVoltageOutput => {
  if (!Number.isFinite(x.code) || !Number.isSafeInteger(x.code) || x.code < 0)
    simpleError("code", "Provide a safe integer at least 0.");
  if (
    !Number.isFinite(x.resolutionBits) ||
    !Number.isSafeInteger(x.resolutionBits) ||
    x.resolutionBits < 0
  )
    simpleError("resolutionBits", "Provide a safe integer at least 0.");
  if (!Number.isFinite(x.referenceVolts) || x.referenceVolts < 0)
    simpleError("referenceVolts", "Provide a finite number at least 0.");
  if (
    !Number.isSafeInteger(x.code) ||
    !Number.isSafeInteger(x.resolutionBits) ||
    x.resolutionBits < 1 ||
    x.resolutionBits > 24 ||
    x.code >= 2 ** x.resolutionBits
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const inputVolts = (x.code * x.referenceVolts) / (2 ** x.resolutionBits - 1);
  if (!Number.isFinite(inputVolts))
    simpleError(
      "inputVolts",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { inputVolts: Object.is(inputVolts, -0) ? 0 : inputVolts };
};

export const example = {
  input: { code: 2048, resolutionBits: 12, referenceVolts: 3.3 },
  output: { inputVolts: 1.6504029304029304 },
} satisfies ToolExample<AdcCodeToVoltageInput, AdcCodeToVoltageOutput>;

export const tool = createSimpleTool({
  id: "microcontroller/adc-code-to-voltage",
  title: "ADC Code To Voltage",
  description:
    "Ideal unipolar endpoint-inclusive ADC code-to-voltage conversion, where the maximum code maps to Vref.",
  inputs: [
    { id: "code", kind: "integer", label: "Code", minimum: 0 },
    {
      id: "resolutionBits",
      kind: "integer",
      label: "Resolution Bits",
      unit: "bits",
      minimum: 0,
    },
    {
      id: "referenceVolts",
      kind: "number",
      label: "Reference Volts",
      unit: "V",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "inputVolts", kind: "number", label: "Input Volts", unit: "V" },
  ],
  calculate: (input) =>
    calculateAdcCodeToVoltage({
      code: input.code as number,
      resolutionBits: input.resolutionBits as number,
      referenceVolts: input.referenceVolts as number,
    }),
});
export const adcCodeToVoltageTool = tool;
export const runAdcCodeToVoltage = tool.execute;
export default tool;
