import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OutputResistanceCascodeInput = {
  readonly roOhms: number;
  readonly transconductanceSiemens: number;
};

export type OutputResistanceCascodeOutput = {
  readonly cascodeResistanceOhms: number;
};

export const outputResistanceCascodeExample = {
  input: { roOhms: 1000, transconductanceSiemens: 0.01 },
  output: { cascodeResistanceOhms: 12000 },
} satisfies ToolExample<
  OutputResistanceCascodeInput,
  OutputResistanceCascodeOutput
>;

export const outputResistanceCascodeTool = createSimpleTool({
  calculate: (input) => {
    const roOhms = input.roOhms as number;
    const transconductanceSiemens = input.transconductanceSiemens as number;
    if (!(transconductanceSiemens > 0))
      simpleError(
        "transconductanceSiemens",
        "Transconductance must be positive.",
        "invalid_transconductance",
      );
    if (!(roOhms > 0))
      simpleError(
        "roOhms",
        "Intrinsic output resistance must be positive.",
        "invalid_resistance",
      );
    const cascodeResistanceOhms =
      2 * roOhms + transconductanceSiemens * roOhms * roOhms;
    if (!Number.isFinite(cascodeResistanceOhms))
      simpleError(
        "roOhms",
        "The cascode resistance is outside the representable range.",
        "numeric_range",
      );
    return { cascodeResistanceOhms };
  },
  description:
    "Estimate the output resistance of two matched cascoded devices as 2ro + gm·ro².",
  id: "semiconductor/output-resistance-cascode",
  inputs: [
    {
      description: "Device intrinsic output resistance.",
      id: "roOhms",
      kind: "number",
      label: "Intrinsic output resistance",
      minimum: Number.MIN_VALUE,
      unit: "ohm",
    },
    {
      description: "Small-signal transconductance of the cascode device.",
      format: "conductance-siemens",
      id: "transconductanceSiemens",
      kind: "number",
      label: "Transconductance",
      minimum: Number.MIN_VALUE,
      unit: "S",
    },
  ],
  outputs: [
    {
      description: "Approximate cascode output resistance.",
      id: "cascodeResistanceOhms",
      kind: "number",
      label: "Cascode output resistance",
      minimum: Number.MIN_VALUE,
      unit: "ohm",
    },
  ],
  title: "Cascode Output Resistance Calculator",
});
export const runOutputResistanceCascode = outputResistanceCascodeTool.execute;
export default outputResistanceCascodeTool;
