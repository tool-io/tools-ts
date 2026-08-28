import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SummingAmplifierTwoInputInput = {
  readonly rfKohm: number;
  readonly v1: number;
  readonly r1Kohm: number;
  readonly v2: number;
  readonly r2Kohm: number;
};

export type SummingAmplifierTwoInputOutput = {
  readonly summingOutputVolts: number;
};

export const summingAmplifierTwoInputExample = {
  input: { rfKohm: 10, v1: 2, r1Kohm: 10, v2: 3, r2Kohm: 15 },
  output: { summingOutputVolts: -4 },
} satisfies ToolExample<
  SummingAmplifierTwoInputInput,
  SummingAmplifierTwoInputOutput
>;

export const calculateSummingAmplifierTwoInput = (
  input: SummingAmplifierTwoInputInput,
): SummingAmplifierTwoInputOutput => {
  if (!(input.rfKohm > 0))
    simpleError(
      "rfKohm",
      "Feedback resistance must be positive.",
      "invalid_rf_kohm",
    );
  if (!(input.r1Kohm > 0))
    simpleError(
      "r1Kohm",
      "Input 1 resistance must be positive.",
      "invalid_r1_kohm",
    );
  if (!(input.r2Kohm > 0))
    simpleError(
      "r2Kohm",
      "Input 2 resistance must be positive.",
      "invalid_r2_kohm",
    );
  return {
    summingOutputVolts: -(
      input.rfKohm *
      (input.v1 / input.r1Kohm + input.v2 / input.r2Kohm)
    ),
  };
};

export const summingAmplifierTwoInputTool = createSimpleTool({
  calculate: (input) =>
    calculateSummingAmplifierTwoInput(
      input as unknown as SummingAmplifierTwoInputInput,
    ),
  description:
    "Compute the inverting two-input summing amplifier output as -(Rf x (V1/R1 + V2/R2)).",
  id: "electronics/summing-amplifier-two-input",
  inputs: [
    { id: "rfKohm", kind: "number", label: "Feedback resistance", unit: "kΩ" },
    { id: "v1", kind: "number", label: "Input 1 voltage", unit: "V" },
    { id: "r1Kohm", kind: "number", label: "Input 1 resistance", unit: "kΩ" },
    { id: "v2", kind: "number", label: "Input 2 voltage", unit: "V" },
    { id: "r2Kohm", kind: "number", label: "Input 2 resistance", unit: "kΩ" },
  ],
  outputs: [
    {
      id: "summingOutputVolts",
      kind: "number",
      label: "Summing output",
      unit: "V",
    },
  ],
  title: "Summing Amp Output",
});
export const runSummingAmplifierTwoInput = summingAmplifierTwoInputTool.execute;
export default summingAmplifierTwoInputTool;
