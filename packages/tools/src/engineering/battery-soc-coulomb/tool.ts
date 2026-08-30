import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BatterySocCoulombInput = Readonly<{
  readonly initialSocPercent: number;
  readonly dischargeCurrentAmperes: number;
  readonly elapsedHours: number;
  readonly capacityAmpHours: number;
}>;
export type BatterySocCoulombOutput = Readonly<{
  readonly remainingSocPercent: number;
}>;

export const calculateBatterySocCoulomb = (
  x: BatterySocCoulombInput,
): BatterySocCoulombOutput => {
  if (!Number.isFinite(x.initialSocPercent) || x.initialSocPercent < 0)
    simpleError("initialSocPercent", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.dischargeCurrentAmperes) ||
    x.dischargeCurrentAmperes < 0
  )
    simpleError(
      "dischargeCurrentAmperes",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.elapsedHours) || x.elapsedHours < 0)
    simpleError("elapsedHours", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.capacityAmpHours) || x.capacityAmpHours < 0)
    simpleError("capacityAmpHours", "Provide a finite number at least 0.");
  if (
    x.initialSocPercent > 100 ||
    x.dischargeCurrentAmperes * x.elapsedHours >
      (x.capacityAmpHours * x.initialSocPercent) / 100
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const remainingSocPercent =
    x.initialSocPercent -
    (100 * x.dischargeCurrentAmperes * x.elapsedHours) / x.capacityAmpHours;
  if (!Number.isFinite(remainingSocPercent))
    simpleError(
      "remainingSocPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    remainingSocPercent: Object.is(remainingSocPercent, -0)
      ? 0
      : remainingSocPercent,
  };
};

export const example = {
  input: {
    initialSocPercent: 80,
    dischargeCurrentAmperes: 2,
    elapsedHours: 1,
    capacityAmpHours: 10,
  },
  output: { remainingSocPercent: 60 },
} satisfies ToolExample<BatterySocCoulombInput, BatterySocCoulombOutput>;

export const tool = createSimpleTool({
  id: "engineering/battery-soc-coulomb",
  title: "Battery SOC Coulomb",
  description:
    "Ideal battery state of charge after a constant discharge current, using nominal amp-hour capacity; ignores coulombic losses and aging.",
  inputs: [
    {
      id: "initialSocPercent",
      kind: "number",
      label: "Initial Soc Percent",
      unit: "%",
      minimum: 0,
    },
    {
      id: "dischargeCurrentAmperes",
      kind: "number",
      label: "Discharge Current Amperes",
      unit: "A",
      minimum: 0,
    },
    {
      id: "elapsedHours",
      kind: "number",
      label: "Elapsed Hours",
      unit: "h",
      minimum: 0,
    },
    {
      id: "capacityAmpHours",
      kind: "number",
      label: "Capacity Amp Hours",
      unit: "Ah",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "remainingSocPercent",
      kind: "number",
      label: "Remaining Soc Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateBatterySocCoulomb({
      initialSocPercent: input.initialSocPercent as number,
      dischargeCurrentAmperes: input.dischargeCurrentAmperes as number,
      elapsedHours: input.elapsedHours as number,
      capacityAmpHours: input.capacityAmpHours as number,
    }),
});
export const batterySocCoulombTool = tool;
export const runBatterySocCoulomb = tool.execute;
export default tool;
