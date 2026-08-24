import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TdbdTimeDependentDielectricBreakdownInput = {
  readonly characteristicFieldMVPerCm: number;
  readonly characteristicTimeSeconds: number;
  readonly operatingFieldMVPerCm: number;
};

export type TdbdTimeDependentDielectricBreakdownOutput = {
  readonly lifetimeSeconds: number;
};

export const tdbdTimeDependentDielectricBreakdownExample = {
  input: {
    characteristicFieldMVPerCm: 10,
    characteristicTimeSeconds: 1e-9,
    operatingFieldMVPerCm: 5,
  },
  output: { lifetimeSeconds: 7.389056098930651e-9 },
} satisfies ToolExample<
  TdbdTimeDependentDielectricBreakdownInput,
  TdbdTimeDependentDielectricBreakdownOutput
>;

export const tdbdTimeDependentDielectricBreakdownTool = createSimpleTool({
  calculate: (input) => {
    const characteristicFieldMVPerCm =
      input.characteristicFieldMVPerCm as number;
    const characteristicTimeSeconds = input.characteristicTimeSeconds as number;
    const operatingFieldMVPerCm = input.operatingFieldMVPerCm as number;
    if (!(characteristicTimeSeconds > 0))
      simpleError(
        "characteristicTimeSeconds",
        "Characteristic time must be positive.",
        "degenerate_input",
      );
    if (!(characteristicFieldMVPerCm > 0))
      simpleError(
        "characteristicFieldMVPerCm",
        "Characteristic field must be positive.",
        "degenerate_input",
      );
    if (!(operatingFieldMVPerCm > 0))
      simpleError(
        "operatingFieldMVPerCm",
        "Operating field must be positive.",
        "degenerate_input",
      );
    const lifetimeSeconds =
      characteristicTimeSeconds *
      Math.exp(characteristicFieldMVPerCm / operatingFieldMVPerCm);
    if (!Number.isFinite(lifetimeSeconds))
      simpleError(
        "operatingFieldMVPerCm",
        "Calculated lifetime exceeds the finite numeric range.",
        "result_overflow",
      );
    return { lifetimeSeconds };
  },
  description:
    "Estimate time-dependent dielectric breakdown lifetime with an empirical inverse-field acceleration model, t = t0 exp(G/E).",
  id: "semiconductor/tdbd-time-dependent-dielectric-breakdown",
  inputs: [
    {
      id: "characteristicTimeSeconds",
      kind: "number",
      label: "Characteristic time",
      unit: "s",
    },
    {
      id: "characteristicFieldMVPerCm",
      kind: "number",
      label: "Characteristic field",
      unit: "MV/cm",
    },
    {
      id: "operatingFieldMVPerCm",
      kind: "number",
      label: "Operating field",
      unit: "MV/cm",
    },
  ],
  outputs: [
    {
      id: "lifetimeSeconds",
      kind: "number",
      label: "Lifetime",
      unit: "s",
    },
  ],
  title: "Inverse-Field TDDB Lifetime Calculator",
});
export const runTdbdTimeDependentDielectricBreakdown =
  tdbdTimeDependentDielectricBreakdownTool.execute;
export default tdbdTimeDependentDielectricBreakdownTool;
