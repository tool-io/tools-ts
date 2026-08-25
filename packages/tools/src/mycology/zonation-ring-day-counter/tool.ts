import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ZonationRingDayCounterInput = {
  readonly daysPerRing: number;
  readonly ringCountInt: number;
};

export type ZonationRingDayCounterOutput = {
  readonly estimatedZoneDays: number;
};

export const zonationRingDayCounterExample = {
  input: { daysPerRing: 2, ringCountInt: 5 },
  output: { estimatedZoneDays: 10 },
} satisfies ToolExample<
  ZonationRingDayCounterInput,
  ZonationRingDayCounterOutput
>;

export const zonationRingDayCounterTool = createSimpleTool({
  id: "mycology/zonation-ring-day-counter",
  title: "Zonation Day Counter",
  description:
    "Estimate elapsed growth time from colony zonation rings and an experimentally established time per ring; one ring does not inherently equal one day.",
  inputs: [
    {
      id: "ringCountInt",
      kind: "integer",
      label: "Ring count",
      minimum: 0,
    },
    {
      description:
        "Elapsed days represented by one ring under the observed growth conditions.",
      id: "daysPerRing",
      kind: "number",
      label: "Days per ring",
    },
  ],
  outputs: [
    {
      id: "estimatedZoneDays",
      label: "Estimated age",
      kind: "number",
      minimum: 0,
      unit: "days",
    },
  ],
  calculate: (input) => {
    const daysPerRing = input.daysPerRing as number;
    if (!(daysPerRing > 0))
      simpleError("daysPerRing", "Days per ring must be positive.");
    return {
      estimatedZoneDays: (input.ringCountInt as number) * daysPerRing,
    };
  },
});
export const runZonationRingDayCounter = zonationRingDayCounterTool.execute;
export default zonationRingDayCounterTool;
