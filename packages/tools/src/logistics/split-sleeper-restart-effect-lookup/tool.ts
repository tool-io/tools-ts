import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SplitSleeperRestartEffectLookupInput = {
  readonly sleeperBerthHours: number;
  readonly otherOffDutyHours: number;
};

export type SplitSleeperRestartEffectLookupOutput = {
  readonly qualifiesAsValidSplit: boolean;
  readonly totalOffDutyHours: number;
};

export const calculateSplitSleeperRestartEffectLookup = (
  input: SplitSleeperRestartEffectLookupInput,
): SplitSleeperRestartEffectLookupOutput => {
  if (!Number.isFinite(input.sleeperBerthHours) || input.sleeperBerthHours < 0)
    return simpleError(
      "sleeperBerthHours",
      "Sleeper-berth hours must be finite and non-negative.",
      "invalid_hours",
    );
  if (!Number.isFinite(input.otherOffDutyHours) || input.otherOffDutyHours < 0)
    return simpleError(
      "otherOffDutyHours",
      "Other off-duty hours must be finite and non-negative.",
      "invalid_hours",
    );
  const totalOffDutyHours = input.sleeperBerthHours + input.otherOffDutyHours;
  if (!Number.isFinite(totalOffDutyHours))
    return simpleError(
      "sleeperBerthHours",
      "Total off-duty time is outside the representable range.",
      "hours_out_of_range",
    );
  return {
    totalOffDutyHours,
    qualifiesAsValidSplit:
      input.sleeperBerthHours >= 7 &&
      input.otherOffDutyHours >= 2 &&
      totalOffDutyHours >= 10,
  };
};

export const splitSleeperRestartEffectLookupExample = {
  input: { sleeperBerthHours: 8, otherOffDutyHours: 2 },
  output: { qualifiesAsValidSplit: true, totalOffDutyHours: 10 },
} satisfies ToolExample<
  SplitSleeperRestartEffectLookupInput,
  SplitSleeperRestartEffectLookupOutput
>;

export const splitSleeperRestartEffectLookupTool = createSimpleTool({
  id: "logistics/split-sleeper-restart-effect-lookup",
  title: "Split Sleeper-Berth Eligibility Checker",
  description:
    "Screen a property-carrying driver's paired rest periods against the FMCSA split sleeper-berth duration rule: at least seven consecutive hours in the berth, at least two other consecutive off-duty hours, and at least ten hours combined. This does not calculate a 34-hour restart.",
  inputs: [
    {
      description: "Consecutive hours spent in the sleeper berth.",
      id: "sleeperBerthHours",
      kind: "number",
      label: "Sleeper berth",
      minimum: 0,
      unit: "h",
    },
    {
      description:
        "The paired consecutive off-duty period, which may be inside or outside the berth.",
      id: "otherOffDutyHours",
      kind: "number",
      label: "Other off duty",
      minimum: 0,
      unit: "h",
    },
  ],
  outputs: [
    {
      description: "Whether the pair satisfies the split-sleeper rule.",
      id: "qualifiesAsValidSplit",
      kind: "boolean",
      label: "Valid split",
    },
    {
      description: "Total combined off-duty hours of the pair.",
      id: "totalOffDutyHours",
      kind: "number",
      label: "Total off duty",
      minimum: 0,
      unit: "h",
    },
  ],
  calculate: (input) =>
    calculateSplitSleeperRestartEffectLookup({
      otherOffDutyHours: input.otherOffDutyHours as number,
      sleeperBerthHours: input.sleeperBerthHours as number,
    }),
});

export const runSplitSleeperRestartEffectLookup =
  splitSleeperRestartEffectLookupTool.execute;
export default splitSleeperRestartEffectLookupTool;
