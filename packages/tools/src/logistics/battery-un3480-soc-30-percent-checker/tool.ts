import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BatteryUn3480Soc30PercentCheckerInput = {
  readonly stateOfChargePercent: number;
};

export type BatteryUn3480Soc30PercentCheckerOutput = {
  readonly compliant: boolean;
  readonly limitPercent: number;
  readonly marginToLimitPercent: number;
};

export const calculateBatteryUn3480Soc30PercentChecker = (
  input: BatteryUn3480Soc30PercentCheckerInput,
): BatteryUn3480Soc30PercentCheckerOutput => {
  if (
    !Number.isFinite(input.stateOfChargePercent) ||
    input.stateOfChargePercent < 0 ||
    input.stateOfChargePercent > 100
  )
    return simpleError(
      "stateOfChargePercent",
      "State of charge must be between zero and one hundred percent.",
      "invalid_percent",
    );
  return {
    compliant: input.stateOfChargePercent <= 30,
    limitPercent: 30,
    marginToLimitPercent: 30 - input.stateOfChargePercent,
  };
};

export const batteryUn3480Soc30PercentCheckerExample = {
  input: { stateOfChargePercent: 27 },
  output: { compliant: true, limitPercent: 30, marginToLimitPercent: 3 },
} satisfies ToolExample<
  BatteryUn3480Soc30PercentCheckerInput,
  BatteryUn3480Soc30PercentCheckerOutput
>;

export const batteryUn3480Soc30PercentCheckerTool = createSimpleTool({
  id: "logistics/battery-un3480-soc-30-percent-checker",
  title: "Battery UN3480 SoC 30 Percent Checker",
  description:
    "Check lithium-ion cells and batteries shipped standalone under UN 3480 against the IATA requirement of a state of charge not exceeding 30 percent of rated capacity.",
  inputs: [
    {
      description: "State of charge in percent of rated capacity.",
      id: "stateOfChargePercent",
      kind: "number",
      label: "State of charge",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "True when the shipment meets the 30 percent rule.",
      id: "compliant",
      kind: "boolean",
      label: "Compliant",
    },
    {
      description: "Fixed IATA limit in percent.",
      id: "limitPercent",
      kind: "number",
      label: "Limit",
      minimum: 30,
      maximum: 30,
      unit: "%",
    },
    {
      description:
        "Limit minus state of charge in points; negative means over limit.",
      id: "marginToLimitPercent",
      kind: "number",
      label: "Margin",
      minimum: -70,
      maximum: 30,
      unit: "percentage points",
    },
  ],
  calculate: (input) =>
    calculateBatteryUn3480Soc30PercentChecker({
      stateOfChargePercent: input.stateOfChargePercent as number,
    }),
});

export const runBatteryUn3480Soc30PercentChecker =
  batteryUn3480Soc30PercentCheckerTool.execute;
export default batteryUn3480Soc30PercentCheckerTool;
