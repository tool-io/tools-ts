import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConcealedDamageWindowCheckerInput = {
  readonly concealedDamageWindowDays?: number;
  readonly daysSinceDelivery: number;
};

export type ConcealedDamageWindowCheckerOutput = {
  readonly daysLeftToReport: number;
  readonly withinReportingWindow: boolean;
};

export const calculateConcealedDamageWindowChecker = (
  input: ConcealedDamageWindowCheckerInput,
): ConcealedDamageWindowCheckerOutput => {
  const concealedDamageWindowDays = input.concealedDamageWindowDays ?? 5;
  if (!Number.isFinite(input.daysSinceDelivery) || input.daysSinceDelivery < 0)
    return simpleError(
      "daysSinceDelivery",
      "Elapsed days must be finite and non-negative.",
      "invalid_days",
    );
  if (
    !Number.isFinite(concealedDamageWindowDays) ||
    concealedDamageWindowDays < 0
  )
    return simpleError(
      "concealedDamageWindowDays",
      "The reporting window must be finite and non-negative.",
      "invalid_window",
    );
  return {
    daysLeftToReport: concealedDamageWindowDays - input.daysSinceDelivery,
    withinReportingWindow: input.daysSinceDelivery <= concealedDamageWindowDays,
  };
};

export const concealedDamageWindowCheckerExample = {
  input: { concealedDamageWindowDays: 5, daysSinceDelivery: 3 },
  output: { daysLeftToReport: 2, withinReportingWindow: true },
} satisfies ToolExample<
  ConcealedDamageWindowCheckerInput,
  ConcealedDamageWindowCheckerOutput
>;

export const concealedDamageWindowCheckerTool = createSimpleTool({
  id: "logistics/concealed-damage-window-checker",
  title: "Concealed Damage Window Checker",
  description:
    "Check elapsed time against a configurable concealed-damage notice window. Confirm the applicable carrier contract, tariff, bill of lading, and law rather than treating the five-day planning default as a universal deadline.",
  inputs: [
    {
      description: "Days elapsed since delivery.",
      id: "daysSinceDelivery",
      kind: "number",
      label: "Days since delivery",
      minimum: 0,
      unit: "d",
    },
    {
      default: 5,
      description:
        "Notice window stated by the applicable carrier terms or rule; the default is for planning only.",
      id: "concealedDamageWindowDays",
      kind: "number",
      label: "Window days",
      minimum: 0,
      unit: "d",
    },
  ],
  outputs: [
    {
      description: "Whether a concealed damage report is still timely.",
      id: "withinReportingWindow",
      kind: "boolean",
      label: "Within window",
    },
    {
      description: "Days left to report (negative once the window has closed).",
      id: "daysLeftToReport",
      kind: "number",
      label: "Days left",
      unit: "d",
    },
  ],
  calculate: (input) =>
    calculateConcealedDamageWindowChecker({
      concealedDamageWindowDays: input.concealedDamageWindowDays as
        number | undefined,
      daysSinceDelivery: input.daysSinceDelivery as number,
    }),
});

export const runConcealedDamageWindowChecker =
  concealedDamageWindowCheckerTool.execute;
export default concealedDamageWindowCheckerTool;
