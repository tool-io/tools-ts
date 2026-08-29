import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const omoriLawAftershockDecayRateExample = {
  input: { productivityK: 50, elapsedDays: 2, cutoffCDays: 0.1, decayP: 1.1 },
  output: {
    ratePerDay: 22.106947513022902,
    expectedNextDayCount: 17.733178166220647,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const omoriLawAftershockDecayRateTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ productivityK, elapsedDays, cutoffCDays, decayP }) => {
      const c = cutoffCDays ?? 0.1;
      const p = decayP ?? 1.1;
      if (!(productivityK >= 0) || !(c > 0) || !(p > 0))
        simpleError(
          "productivityK",
          "Productivity must be nonnegative; c and p must be positive.",
        );
      const integratedCount =
        p === 1
          ? productivityK * Math.log((elapsedDays + 1 + c) / (elapsedDays + c))
          : (productivityK / (1 - p)) *
            (Math.pow(elapsedDays + 1 + c, 1 - p) -
              Math.pow(elapsedDays + c, 1 - p));
      return {
        ratePerDay: productivityK / Math.pow(elapsedDays + c, p),
        expectedNextDayCount: integratedCount,
      };
    })(input as never) as Record<string, unknown>,
  description: "Modified Omori law daily aftershock rate n(t) = k/(t+c)^p.",
  id: "seismology/omori-law-aftershock-decay-rate",
  inputs: [
    {
      minimum: 0,
      description: "Productivity constant at t=0.",
      id: "productivityK",
      kind: "number",
      label: "k",
    },
    {
      minimum: 0,
      description: "Time since the mainshock.",
      id: "elapsedDays",
      kind: "number",
      label: "t",
      unit: "d",
    },
    {
      default: 0.1,
      description: "Omori c offset.",
      id: "cutoffCDays",
      kind: "number",
      label: "c",
      unit: "d",
    },
    {
      default: 1.1,
      description: "Decay exponent.",
      id: "decayP",
      kind: "number",
      label: "p",
    },
  ],
  outputs: [
    {
      description: "Aftershock rate per day.",
      id: "ratePerDay",
      kind: "number",
      label: "n(t)",
      unit: "1/d",
    },
    {
      description: "Expected events over the following day.",
      id: "expectedNextDayCount",
      kind: "number",
      label: "N(t,t+1)",
    },
  ],
  title: "Omori Law Aftershock Decay Rate Calculator",
});
export const runOmoriLawAftershockDecayRate =
  omoriLawAftershockDecayRateTool.execute;
export { omoriLawAftershockDecayRateExample as example };
export default omoriLawAftershockDecayRateTool;
