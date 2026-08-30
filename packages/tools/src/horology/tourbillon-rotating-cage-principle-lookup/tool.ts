import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TourbillonCageInput = {
  readonly cagePeriodSeconds: number;
};

export type TourbillonCageOutput = {
  readonly cageAngularRateDegreesPerSecond: number;
  readonly cageRevolutionsPerDay: number;
  readonly classicOneMinuteCage: boolean;
  readonly principle: string;
};

export const lookupTourbillonRotatingCagePrinciple = (
  input: TourbillonCageInput,
): TourbillonCageOutput => {
  if (!Number.isFinite(input.cagePeriodSeconds) || input.cagePeriodSeconds <= 0)
    simpleError(
      "cagePeriodSeconds",
      "Cage period must be a finite positive number of seconds.",
      "cage_period_invalid",
    );
  const cageRevolutionsPerDay = 86_400 / input.cagePeriodSeconds;
  const cageAngularRateDegreesPerSecond = 360 / input.cagePeriodSeconds;
  if (
    !Number.isFinite(cageRevolutionsPerDay) ||
    !Number.isFinite(cageAngularRateDegreesPerSecond)
  )
    simpleError("", "The cage rate is not finite.", "result_not_finite");
  return {
    cageAngularRateDegreesPerSecond,
    cageRevolutionsPerDay,
    classicOneMinuteCage: input.cagePeriodSeconds === 60,
    principle:
      "A tourbillon rotates the balance and escapement assembly in a cage so changing gravitational orientation is averaged over rotation; this does not guarantee a particular chronometric result.",
  };
};

export const tourbillonCageExample = {
  input: { cagePeriodSeconds: 60 },
  output: {
    cageAngularRateDegreesPerSecond: 6,
    cageRevolutionsPerDay: 1440,
    classicOneMinuteCage: true,
    principle:
      "A tourbillon rotates the balance and escapement assembly in a cage so changing gravitational orientation is averaged over rotation; this does not guarantee a particular chronometric result.",
  },
} satisfies ToolExample<TourbillonCageInput, TourbillonCageOutput>;

export const tourbillonCageTool = createSimpleTool({
  calculate: (input) =>
    lookupTourbillonRotatingCagePrinciple({
      cagePeriodSeconds: input.cagePeriodSeconds as number,
    }),
  description:
    "State the rotating-cage principle and calculate cage speed for a caller-supplied tourbillon rotation period.",
  id: "horology/tourbillon-rotating-cage-principle-lookup",
  inputs: [
    {
      id: "cagePeriodSeconds",
      kind: "number",
      label: "Cage rotation period",
      minimum: 0,
      unit: "s",
    },
  ],
  outputs: [
    {
      id: "cageAngularRateDegreesPerSecond",
      kind: "number",
      label: "Cage angular rate",
      minimum: 0,
      unit: "deg/s",
    },
    {
      id: "cageRevolutionsPerDay",
      kind: "number",
      label: "Cage revolutions per day",
      minimum: 0,
      unit: "rev/day",
    },
    {
      id: "classicOneMinuteCage",
      kind: "boolean",
      label: "Classic one-minute cage",
    },
    { id: "principle", kind: "string", label: "Rotating-cage principle" },
  ],
  title: "Tourbillon Rotating Cage Principle Lookup",
});

export const runTourbillonCage = tourbillonCageTool.execute;
export default tourbillonCageTool;
