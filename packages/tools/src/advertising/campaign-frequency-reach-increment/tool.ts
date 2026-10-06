import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousReach: number;
  readonly newUniquePeople: number;
  readonly totalImpressions: number;
};
export type Output = {
  readonly updatedReach: number;
  readonly meanFrequency: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousReach: { type: "integer", minimum: 0 },
    newUniquePeople: { type: "integer", minimum: 0 },
    totalImpressions: { type: "integer", minimum: 0 },
  },
  required: ["previousReach", "newUniquePeople", "totalImpressions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    updatedReach: { type: "integer" },
    meanFrequency: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["updatedReach", "meanFrequency", "defined"],
} as const;
/** Update explicit reach with a supplied disjoint unique-person increment and compare compatible impression counts without identifying people. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousReach, newUniquePeople, totalImpressions } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(previousReach) &&
        previousReach >= 0 &&
        previousReach <= Number.MAX_SAFE_INTEGER,
      "previousReach",
    ),
      previousReach);
    (H.domain(
      Number.isSafeInteger(newUniquePeople) &&
        newUniquePeople >= 0 &&
        newUniquePeople <= Number.MAX_SAFE_INTEGER,
      "newUniquePeople",
    ),
      newUniquePeople);
    (H.domain(
      Number.isSafeInteger(totalImpressions) &&
        totalImpressions >= 0 &&
        totalImpressions <= Number.MAX_SAFE_INTEGER,
      "totalImpressions",
    ),
      totalImpressions);
    return (() => {
      const updatedReach = Number(
        BigInt(previousReach) + BigInt(newUniquePeople),
      );
      H.domain(totalImpressions >= updatedReach, "totalImpressions");
      return {
        updatedReach,
        meanFrequency: updatedReach > 0 ? totalImpressions / updatedReach : 0,
        defined: updatedReach > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousReach: 100, newUniquePeople: 20, totalImpressions: 300 },
  output: { updatedReach: 120, meanFrequency: 2.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const campaignFrequencyReachIncrementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["advertising", "business and finance"],
      keywords: ["advertising", "business and finance"],
    },
    id: "advertising/campaign-frequency-reach-increment",
    title: "Campaign Frequency Reach Increment",
    description:
      "Update explicit reach with a supplied disjoint unique-person increment and compare compatible impression counts without identifying people.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousReach: { type: "integer", minimum: 0 },
        newUniquePeople: { type: "integer", minimum: 0 },
        totalImpressions: { type: "integer", minimum: 0 },
      },
      required: ["previousReach", "newUniquePeople", "totalImpressions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        updatedReach: { type: "integer" },
        meanFrequency: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["updatedReach", "meanFrequency", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "previousReach",
          label: "Previous Reach",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "newUniquePeople",
          label: "New Unique People",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalImpressions",
          label: "Total Impressions",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "updatedReach",
          label: "Updated Reach",
          valueType: { type: "integer" },
        },
        {
          id: "meanFrequency",
          label: "Mean Frequency",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = campaignFrequencyReachIncrementTool.execute;
export default campaignFrequencyReachIncrementTool;
