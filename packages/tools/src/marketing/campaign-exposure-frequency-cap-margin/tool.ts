import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedExposureCount: number;
  readonly suppliedCap: number;
};
export type Output = {
  readonly remainingBeforeCap: number;
  readonly excessCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedExposureCount: { type: "integer", minimum: 0 },
    suppliedCap: { type: "integer", minimum: 0 },
  },
  required: ["recordedExposureCount", "suppliedCap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingBeforeCap: { type: "integer" },
    excessCount: { type: "integer" },
  },
  required: ["remainingBeforeCap", "excessCount"],
} as const;
/** Compare an explicit exposure count with a supplied frequency cap without tracking users or setting advertising policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedExposureCount, suppliedCap } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(recordedExposureCount) &&
        recordedExposureCount >= 0 &&
        recordedExposureCount <= Number.MAX_SAFE_INTEGER,
      "recordedExposureCount",
    ),
      recordedExposureCount);
    (H.domain(
      Number.isSafeInteger(suppliedCap) &&
        suppliedCap >= 0 &&
        suppliedCap <= Number.MAX_SAFE_INTEGER,
      "suppliedCap",
    ),
      suppliedCap);
    return {
      remainingBeforeCap: Math.max(0, suppliedCap - recordedExposureCount),
      excessCount: Math.max(0, recordedExposureCount - suppliedCap),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedExposureCount: 3, suppliedCap: 5 },
  output: { remainingBeforeCap: 2, excessCount: 0 },
} satisfies ToolExample<Input, Output>;
export const campaignExposureFrequencyCapMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["marketing", "business and finance"],
      keywords: ["marketing", "business and finance"],
    },
    id: "marketing/campaign-exposure-frequency-cap-margin",
    title: "Campaign Exposure Frequency Cap Margin",
    description:
      "Compare an explicit exposure count with a supplied frequency cap without tracking users or setting advertising policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedExposureCount: { type: "integer", minimum: 0 },
        suppliedCap: { type: "integer", minimum: 0 },
      },
      required: ["recordedExposureCount", "suppliedCap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingBeforeCap: { type: "integer" },
        excessCount: { type: "integer" },
      },
      required: ["remainingBeforeCap", "excessCount"],
    },
    ports: {
      inputs: [
        {
          id: "recordedExposureCount",
          label: "Recorded Exposure Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedCap",
          label: "Supplied Cap",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "remainingBeforeCap",
          label: "Remaining Before Cap",
          valueType: { type: "integer" },
        },
        {
          id: "excessCount",
          label: "Excess Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = campaignExposureFrequencyCapMarginTool.execute;
export default campaignExposureFrequencyCapMarginTool;
