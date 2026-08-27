import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LeadIsotopeRatioInput = {
  readonly pb204: number;
  readonly pb206: number;
  readonly pb207: number;
  readonly pb208: number;
};

export type LeadIsotopeRatioOutput = {
  readonly pb206Pb204: number;
  readonly pb207Pb204: number;
  readonly pb208Pb204: number;
};

/**
 * Common lead isotope ratios referenced to the sole stable,
 * non-radiogenic isotope 204Pb.
 */
export const calculateLeadIsotopeRatio = (
  input: LeadIsotopeRatioInput,
): LeadIsotopeRatioOutput => {
  for (const key of ["pb204", "pb206", "pb207", "pb208"] as const) {
    if (!((input[key] as number) > 0))
      return simpleError(
        key,
        "Lead isotope amounts must be greater than zero.",
        "invalid_amount",
      );
  }
  return {
    pb206Pb204: input.pb206 / input.pb204,
    pb207Pb204: input.pb207 / input.pb204,
    pb208Pb204: input.pb208 / input.pb204,
  };
};

export const leadIsotopeRatioExample = {
  input: { pb204: 1, pb206: 18.1, pb207: 15.63, pb208: 38.6 },
  output: { pb206Pb204: 18.1, pb207Pb204: 15.63, pb208Pb204: 38.6 },
} satisfies ToolExample<LeadIsotopeRatioInput, LeadIsotopeRatioOutput>;

export const leadIsotopeRatioTool = createSimpleTool({
  id: "geology/lead-isotope-ratio",
  title: "Geology Lead Isotope Ratio Calculator",
  description:
    "Normalize measured lead isotope amounts to 204Pb to obtain the standard 206Pb/204Pb, 207Pb/204Pb and 208Pb/204Pb ratios.",
  inputs: [
    {
      description: "Amount or signal of 204Pb.",
      id: "pb204",
      kind: "number",
      label: "204Pb",
      minimum: 0,
    },
    {
      description: "Amount or signal of 206Pb.",
      id: "pb206",
      kind: "number",
      label: "206Pb",
      minimum: 0,
    },
    {
      description: "Amount or signal of 207Pb.",
      id: "pb207",
      kind: "number",
      label: "207Pb",
      minimum: 0,
    },
    {
      description: "Amount or signal of 208Pb.",
      id: "pb208",
      kind: "number",
      label: "208Pb",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "206Pb/204Pb ratio.",
      id: "pb206Pb204",
      kind: "number",
      label: "206Pb/204Pb",
    },
    {
      description: "207Pb/204Pb ratio.",
      id: "pb207Pb204",
      kind: "number",
      label: "207Pb/204Pb",
    },
    {
      description: "208Pb/204Pb ratio.",
      id: "pb208Pb204",
      kind: "number",
      label: "208Pb/204Pb",
    },
  ],
  calculate: (input) =>
    calculateLeadIsotopeRatio(input as unknown as LeadIsotopeRatioInput),
});

export const runLeadIsotopeRatio = leadIsotopeRatioTool.execute;
export default leadIsotopeRatioTool;
