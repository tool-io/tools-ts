import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BatterySelfDischargePerMonthInput = Readonly<{
  readonly initialChargeAh: number;
  readonly finalChargeAh: number;
}>;
export type BatterySelfDischargePerMonthOutput = Readonly<{
  selfDischargePercent: number;
}>;

export const calculateBatterySelfDischargePerMonth = (
  i: BatterySelfDischargePerMonthInput,
): BatterySelfDischargePerMonthOutput => {
  if (i.finalChargeAh > i.initialChargeAh)
    simpleError(
      "finalChargeAh",
      "Final charge cannot exceed initial charge in a discharge-only model.",
    );
  const value =
    (100 * (i.initialChargeAh - i.finalChargeAh)) / i.initialChargeAh;
  if (!Number.isFinite(value))
    simpleError(
      "selfDischargePercent",
      "The inputs produce a non-finite result.",
    );
  return { selfDischargePercent: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { initialChargeAh: 50, finalChargeAh: 48 },
  output: { selfDischargePercent: 4 },
} satisfies ToolExample<
  BatterySelfDischargePerMonthInput,
  BatterySelfDischargePerMonthOutput
>;

export const tool = createSimpleTool({
  id: "electronics/battery-self-discharge-per-month",
  title: "Battery Self Discharge Per Month",
  description:
    "Calculate one-month battery self-discharge percentage from stored charge before and after an approximately one-month rest; exclude external loads.",
  inputs: [
    {
      id: "initialChargeAh",
      kind: "number",
      label: "Initial (Ah)",
      unit: "Ah",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "finalChargeAh",
      kind: "number",
      label: "Final (Ah)",
      unit: "Ah",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "selfDischargePercent",
      kind: "number",
      label: "Self Discharge (%)",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateBatterySelfDischargePerMonth({
      initialChargeAh: input.initialChargeAh as number,
      finalChargeAh: input.finalChargeAh as number,
    }),
});
export const batterySelfDischargePerMonthTool = tool;
export const runBatterySelfDischargePerMonth = tool.execute;
export default tool;
