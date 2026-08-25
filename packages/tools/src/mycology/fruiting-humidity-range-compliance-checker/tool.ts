import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const fruitingHumidityRangeComplianceCheckerExample = {
  input: {
    humidityPercent: 90,
    maximumTargetHumidityPercent: 95,
    minimumTargetHumidityPercent: 85,
  },
  output: { relativeHumidityPercent: 90, withinTargetRange: true },
} satisfies ToolExample<
  {
    readonly humidityPercent: number;
    readonly maximumTargetHumidityPercent: number;
    readonly minimumTargetHumidityPercent: number;
  },
  {
    readonly relativeHumidityPercent: number;
    readonly withinTargetRange: boolean;
  }
>;

export const fruitingHumidityRangeComplianceCheckerTool = createSimpleTool({
  id: "mycology/fruiting-humidity-range-compliance-checker",
  title: "Humidity Compliance",
  description:
    "Check measured fruiting relative humidity against caller-supplied minimum and maximum targets appropriate to the cultivated species and fruiting stage.",
  inputs: [
    {
      id: "humidityPercent",
      label: "Relative humidity",
      kind: "number",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "minimumTargetHumidityPercent",
      label: "Minimum target humidity",
      kind: "number",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "maximumTargetHumidityPercent",
      label: "Maximum target humidity",
      kind: "number",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "withinTargetRange",
      label: "Within target range",
      kind: "boolean",
    },
    {
      id: "relativeHumidityPercent",
      label: "Relative humidity",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const relativeHumidityPercent = input.humidityPercent as number;
    const minimumTargetHumidityPercent =
      input.minimumTargetHumidityPercent as number;
    const maximumTargetHumidityPercent =
      input.maximumTargetHumidityPercent as number;
    if (minimumTargetHumidityPercent > maximumTargetHumidityPercent)
      simpleError(
        "maximumTargetHumidityPercent",
        "Maximum target humidity must be at least the minimum target humidity.",
      );
    return {
      relativeHumidityPercent,
      withinTargetRange:
        relativeHumidityPercent >= minimumTargetHumidityPercent &&
        relativeHumidityPercent <= maximumTargetHumidityPercent,
    };
  },
});
export const runFruitingHumidityRangeComplianceChecker =
  fruitingHumidityRangeComplianceCheckerTool.execute;
export default fruitingHumidityRangeComplianceCheckerTool;
