import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const ld50Example = {
  input: {
    doseHigh: 100,
    doseLow: 10,
    responseHighFraction: 0.75,
    responseLowFraction: 0.25,
  },
} satisfies ToolExample<{
  readonly doseHigh: number;
  readonly doseLow: number;
  readonly responseHighFraction: number;
  readonly responseLowFraction: number;
}>;

export const ld50Tool = createSimpleTool({
  id: "biology/ld50",
  title: "LD50 Log-Dose Interpolation",
  description:
    "Estimate LD50 by linear interpolation of response against log10 dose between an ordered lower point at or below 50% mortality and an ordered higher point at or above 50%. This is a two-point estimate, not a fitted dose-response model.",
  inputs: [
    { id: "doseLow", label: "Lower dose", kind: "number" },
    { id: "doseHigh", label: "Higher dose", kind: "number" },
    {
      id: "responseLowFraction",
      label: "Response at lower dose",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
    {
      id: "responseHighFraction",
      label: "Response at higher dose",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [{ id: "estimatedLd50", label: "Estimated LD50", kind: "number" }],
  calculate: (input) => {
    const doseLow = input.doseLow as number;
    const doseHigh = input.doseHigh as number;
    const responseLowFraction = input.responseLowFraction as number;
    const responseHighFraction = input.responseHighFraction as number;
    if (doseLow <= 0 || doseHigh <= 0)
      simpleError(
        "doseLow",
        "Doses must be greater than zero.",
        "invalid_dose",
      );
    if (!(doseHigh > doseLow))
      simpleError(
        "doseHigh",
        "The higher dose must be greater than the lower dose.",
        "invalid_dose_order",
      );
    if (!(responseHighFraction > responseLowFraction))
      simpleError(
        "responseHighFraction",
        "Response must increase between the lower and higher dose.",
        "invalid_response_order",
      );
    if (responseLowFraction > 0.5 || responseHighFraction < 0.5)
      simpleError(
        "responseLowFraction",
        "The two response points must bracket fifty percent mortality.",
        "unbracketed_response",
      );
    const fraction =
      (0.5 - responseLowFraction) /
      (responseHighFraction - responseLowFraction);
    return {
      estimatedLd50: Math.pow(
        10,
        Math.log10(doseLow) +
          fraction * (Math.log10(doseHigh) - Math.log10(doseLow)),
      ),
    };
  },
});
export const runLd50 = ld50Tool.execute;
export default ld50Tool;
