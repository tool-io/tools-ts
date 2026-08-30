import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SuperjunctionChargeBalanceInput = Readonly<{
  readonly donorPerCubicMeter: number;
  readonly donorWidthMeters: number;
  readonly acceptorPerCubicMeter: number;
  readonly acceptorWidthMeters: number;
}>;
export type SuperjunctionChargeBalanceOutput = Readonly<{
  readonly imbalanceCoulombsPerSquareMeter: number;
}>;

export const calculateSuperjunctionChargeBalance = (
  x: SuperjunctionChargeBalanceInput,
): SuperjunctionChargeBalanceOutput => {
  if (!Number.isFinite(x.donorPerCubicMeter) || x.donorPerCubicMeter < 0)
    simpleError("donorPerCubicMeter", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.donorWidthMeters) || x.donorWidthMeters < 0)
    simpleError("donorWidthMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.acceptorPerCubicMeter) || x.acceptorPerCubicMeter < 0)
    simpleError("acceptorPerCubicMeter", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.acceptorWidthMeters) || x.acceptorWidthMeters < 0)
    simpleError("acceptorWidthMeters", "Provide a finite number at least 0.");
  const imbalanceCoulombsPerSquareMeter =
    1.602176634e-19 *
    (x.donorPerCubicMeter * x.donorWidthMeters -
      x.acceptorPerCubicMeter * x.acceptorWidthMeters);
  if (!Number.isFinite(imbalanceCoulombsPerSquareMeter))
    simpleError(
      "imbalanceCoulombsPerSquareMeter",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    imbalanceCoulombsPerSquareMeter: Object.is(
      imbalanceCoulombsPerSquareMeter,
      -0,
    )
      ? 0
      : imbalanceCoulombsPerSquareMeter,
  };
};

export const example = {
  input: {
    donorPerCubicMeter: 1e22,
    donorWidthMeters: 0.000001,
    acceptorPerCubicMeter: 1e22,
    acceptorWidthMeters: 0.000001,
  },
  output: { imbalanceCoulombsPerSquareMeter: 0 },
} satisfies ToolExample<
  SuperjunctionChargeBalanceInput,
  SuperjunctionChargeBalanceOutput
>;

export const tool = createSimpleTool({
  id: "semiconductor/superjunction-charge-balance",
  title: "Superjunction Charge Balance",
  description:
    "Signed superjunction pillar sheet-charge imbalance, donor minus acceptor, from concentrations and pillar widths.",
  inputs: [
    {
      id: "donorPerCubicMeter",
      kind: "number",
      label: "Donor Per Cubic Meter",
      unit: "m⁻³",
      minimum: 0,
    },
    {
      id: "donorWidthMeters",
      kind: "number",
      label: "Donor Width Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "acceptorPerCubicMeter",
      kind: "number",
      label: "Acceptor Per Cubic Meter",
      unit: "m⁻³",
      minimum: 0,
    },
    {
      id: "acceptorWidthMeters",
      kind: "number",
      label: "Acceptor Width Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "imbalanceCoulombsPerSquareMeter",
      kind: "number",
      label: "Imbalance Coulombs Per Square Meter",
      unit: "C/m²",
    },
  ],
  calculate: (input) =>
    calculateSuperjunctionChargeBalance({
      donorPerCubicMeter: input.donorPerCubicMeter as number,
      donorWidthMeters: input.donorWidthMeters as number,
      acceptorPerCubicMeter: input.acceptorPerCubicMeter as number,
      acceptorWidthMeters: input.acceptorWidthMeters as number,
    }),
});
export const superjunctionChargeBalanceTool = tool;
export const runSuperjunctionChargeBalance = tool.execute;
export default tool;
