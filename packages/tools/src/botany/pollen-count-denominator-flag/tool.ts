import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly identifiedCount: number;
  readonly unidentifiedCount: number;
  readonly includeUnidentified: boolean;
  readonly targetCount: number;
};
export type Output = {
  readonly denominator: number;
  readonly targetFraction: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    identifiedCount: { type: "integer", minimum: 0 },
    unidentifiedCount: { type: "integer", minimum: 0 },
    includeUnidentified: { type: "boolean" },
    targetCount: { type: "integer", minimum: 0 },
  },
  required: [
    "identifiedCount",
    "unidentifiedCount",
    "includeUnidentified",
    "targetCount",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    targetFraction: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["denominator", "targetFraction", "defined"],
} as const;
/** Calculate an explicit pollen-count fraction with a caller-selected unidentified-count denominator policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    identifiedCount,
    unidentifiedCount,
    includeUnidentified,
    targetCount,
  } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(identifiedCount) &&
        identifiedCount >= 0 &&
        identifiedCount <= Number.MAX_SAFE_INTEGER,
      "identifiedCount",
    ),
      identifiedCount);
    (H.domain(
      Number.isSafeInteger(unidentifiedCount) &&
        unidentifiedCount >= 0 &&
        unidentifiedCount <= Number.MAX_SAFE_INTEGER,
      "unidentifiedCount",
    ),
      unidentifiedCount);
    (H.domain(
      Number.isSafeInteger(targetCount) &&
        targetCount >= 0 &&
        targetCount <= identifiedCount,
      "targetCount",
    ),
      targetCount);
    return (() => {
      const denominator =
        identifiedCount + (includeUnidentified ? unidentifiedCount : 0);
      return {
        denominator,
        targetFraction: denominator > 0 ? targetCount / denominator : 0,
        defined: denominator > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    identifiedCount: 80,
    unidentifiedCount: 20,
    includeUnidentified: true,
    targetCount: 30,
  },
  output: { denominator: 100, targetFraction: 0.3, defined: true },
} satisfies ToolExample<Input, Output>;
export const pollenCountDenominatorFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["botany", "biology"],
      keywords: ["botany", "biology"],
    },
    id: "botany/pollen-count-denominator-flag",
    title: "Pollen Count Denominator Flag",
    description:
      "Calculate an explicit pollen-count fraction with a caller-selected unidentified-count denominator policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        identifiedCount: { type: "integer", minimum: 0 },
        unidentifiedCount: { type: "integer", minimum: 0 },
        includeUnidentified: { type: "boolean" },
        targetCount: { type: "integer", minimum: 0 },
      },
      required: [
        "identifiedCount",
        "unidentifiedCount",
        "includeUnidentified",
        "targetCount",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        targetFraction: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["denominator", "targetFraction", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "identifiedCount",
          label: "Identified Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unidentifiedCount",
          label: "Unidentified Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeUnidentified",
          label: "Include Unidentified",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "targetCount",
          label: "Target Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        {
          id: "targetFraction",
          label: "Target Fraction",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = pollenCountDenominatorFlagTool.execute;
export default pollenCountDenominatorFlagTool;
