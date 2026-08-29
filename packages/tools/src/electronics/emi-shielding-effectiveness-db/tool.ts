import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EmiShieldingEffectivenessDbInput = Readonly<{
  readonly incidentFieldVPerM: number;
  readonly transmittedFieldVPerM: number;
}>;
export type EmiShieldingEffectivenessDbOutput = Readonly<{
  shieldingEffectivenessDb: number;
}>;

export const calculateEmiShieldingEffectivenessDb = (
  i: EmiShieldingEffectivenessDbInput,
): EmiShieldingEffectivenessDbOutput => {
  const ratio = i.incidentFieldVPerM / i.transmittedFieldVPerM;
  const value =
    ratio > 0 && Number.isFinite(ratio)
      ? 20 * Math.log10(ratio)
      : 20 *
        (Math.log10(i.incidentFieldVPerM) -
          Math.log10(i.transmittedFieldVPerM));
  if (!Number.isFinite(value))
    simpleError(
      "shieldingEffectivenessDb",
      "The inputs produce a non-finite result.",
    );
  return { shieldingEffectivenessDb: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { incidentFieldVPerM: 10, transmittedFieldVPerM: 0.1 },
  output: { shieldingEffectivenessDb: 40 },
} satisfies ToolExample<
  EmiShieldingEffectivenessDbInput,
  EmiShieldingEffectivenessDbOutput
>;

export const tool = createSimpleTool({
  id: "electronics/emi-shielding-effectiveness-db",
  title: "EMI Shielding Effectiveness dB",
  description:
    "Estimate electromagnetic shielding effectiveness from incident and transmitted electric-field amplitudes using 20 log10(Ein/Eout); both must use the same units.",
  inputs: [
    {
      id: "incidentFieldVPerM",
      kind: "number",
      label: "Incident field (V/m)",
      unit: "V/m",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "transmittedFieldVPerM",
      kind: "number",
      label: "Transmitted field (V/m)",
      unit: "V/m",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "shieldingEffectivenessDb",
      kind: "number",
      label: "Shielding effectiveness (dB)",
      unit: "dB",
    },
  ],
  calculate: (input) =>
    calculateEmiShieldingEffectivenessDb({
      incidentFieldVPerM: input.incidentFieldVPerM as number,
      transmittedFieldVPerM: input.transmittedFieldVPerM as number,
    }),
});
export const emiShieldingEffectivenessDbTool = tool;
export const runEmiShieldingEffectivenessDb = tool.execute;
export default tool;
