import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly releaseLength: number;
  readonly recaptureLength: number;
  readonly days: number;
};
export type Output = {
  readonly increment: number;
  readonly dailyIncrement: number;
  readonly annualizedIncrement: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    releaseLength: { type: "number", minimum: 0 },
    recaptureLength: { type: "number", minimum: 0 },
    days: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["releaseLength", "recaptureLength", "days"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    increment: { type: "number" },
    dailyIncrement: { type: "number" },
    annualizedIncrement: { type: "number" },
  },
  required: ["increment", "dailyIncrement", "annualizedIncrement"],
} as const;
/** Signed observed length increment with an explicit 365-day annualized rate, not an extrapolated biological growth curve. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { releaseLength, recaptureLength, days } = request;
  const compute = (): Output => {
    H.domain(releaseLength >= 0 && recaptureLength >= 0);
    H.positive(days);
    return {
      increment: recaptureLength - releaseLength,
      dailyIncrement: (recaptureLength - releaseLength) / days,
      annualizedIncrement: (365 * (recaptureLength - releaseLength)) / days,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { releaseLength: 100, recaptureLength: 118, days: 90 },
  output: { increment: 18, dailyIncrement: 0.2, annualizedIncrement: 73 },
} satisfies ToolExample<Input, Output>;
export const fishTagRecaptureLengthIncrementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/fish-tag-recapture-length-increment",
    title: "Fish Tag Recapture Length Increment Tool",
    description:
      "Signed observed length increment with an explicit 365-day annualized rate, not an extrapolated biological growth curve.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        releaseLength: { type: "number", minimum: 0 },
        recaptureLength: { type: "number", minimum: 0 },
        days: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["releaseLength", "recaptureLength", "days"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        increment: { type: "number" },
        dailyIncrement: { type: "number" },
        annualizedIncrement: { type: "number" },
      },
      required: ["increment", "dailyIncrement", "annualizedIncrement"],
    },
    ports: {
      inputs: [
        {
          id: "releaseLength",
          label: "Release Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recaptureLength",
          label: "Recapture Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "days",
          label: "Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "increment", label: "Increment", valueType: { type: "number" } },
        {
          id: "dailyIncrement",
          label: "Daily Increment",
          valueType: { type: "number" },
        },
        {
          id: "annualizedIncrement",
          label: "Annualized Increment",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fishTagRecaptureLengthIncrementTool.execute;
export default fishTagRecaptureLengthIncrementTool;
