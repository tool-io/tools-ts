import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly internCount: number;
  readonly offerCount: number;
  readonly acceptedCount: number;
}>;
export type Output = Readonly<{
  readonly offerRatePercent: number;
  readonly acceptanceRatePercent: number;
  readonly overallConversionPercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.offerCount > input.internCount ||
    input.acceptedCount > input.offerCount
  )
    simpleError(
      "offerCount",
      "Counts must be nonincreasing through the funnel.",
      "invalid_funnel",
    );
  return {
    offerRatePercent:
      input.internCount === 0
        ? 0
        : (input.offerCount / input.internCount) * 100,
    acceptanceRatePercent:
      input.offerCount === 0
        ? 0
        : (input.acceptedCount / input.offerCount) * 100,
    overallConversionPercent:
      input.internCount === 0
        ? 0
        : (input.acceptedCount / input.internCount) * 100,
  };
};

export const exampleInput = {
  internCount: 40,
  offerCount: 12,
  acceptedCount: 9,
} satisfies Input;
export const exampleOutput = {
  offerRatePercent: 30,
  acceptanceRatePercent: 75,
  overallConversionPercent: 22.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      internCount: input.internCount as number,
      offerCount: input.offerCount as number,
      acceptedCount: input.acceptedCount as number,
    }),
  description:
    "Calculate offer, acceptance, and overall conversion rates for an internship cohort.",
  id: "journalism/internship-conversion-rate",
  inputs: [
    { id: "internCount", label: "Intern count", kind: "integer", minimum: 0 },
    { id: "offerCount", label: "Offer count", kind: "integer", minimum: 0 },
    {
      id: "acceptedCount",
      label: "Accepted count",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "offerRatePercent",
      label: "Offer rate",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "acceptanceRatePercent",
      label: "Acceptance rate",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "overallConversionPercent",
      label: "Overall conversion",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  title: "Internship Conversion Rate",
});

export const run = tool.execute;
export default tool;
