import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tankVolume: number;
  readonly bedVolume: number;
  readonly targetBedToTank: number;
  readonly excludedBedVolume: number;
};
export type Output = {
  readonly usableBedVolume: number;
  readonly observedRatio: number;
  readonly ratioGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tankVolume: { type: "number", exclusiveMinimum: 0 },
    bedVolume: { type: "number", minimum: 0 },
    targetBedToTank: { type: "number", minimum: 0 },
    excludedBedVolume: { type: "number", minimum: 0 },
  },
  required: ["tankVolume", "bedVolume", "targetBedToTank", "excludedBedVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usableBedVolume: { type: "number" },
    observedRatio: { type: "number" },
    ratioGap: { type: "number" },
  },
  required: ["usableBedVolume", "observedRatio", "ratioGap"],
} as const;
/** Compare explicit usable bed and tank volumes against a supplied ratio; no stocking or husbandry recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tankVolume, bedVolume, targetBedToTank, excludedBedVolume } = request;
  const compute = (): Output => {
    H.positive(tankVolume);
    H.domain(
      bedVolume >= 0 &&
        excludedBedVolume >= 0 &&
        excludedBedVolume <= bedVolume &&
        targetBedToTank >= 0,
    );
    return (() => {
      const usableBedVolume = bedVolume - excludedBedVolume,
        observedRatio = usableBedVolume / tankVolume;
      return {
        usableBedVolume,
        observedRatio,
        ratioGap: observedRatio - targetBedToTank,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    tankVolume: 10,
    bedVolume: 8,
    targetBedToTank: 0.5,
    excludedBedVolume: 2,
  },
  output: {
    usableBedVolume: 6,
    observedRatio: 0.6,
    ratioGap: 0.09999999999999998,
  },
} satisfies ToolExample<Input, Output>;
export const tankBedReferenceGapTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "aquaponics/tank-bed-reference-gap",
      title: "Tank BED Reference Gap Tool",
      description:
        "Compare explicit usable bed and tank volumes against a supplied ratio; no stocking or husbandry recommendation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          tankVolume: { type: "number", exclusiveMinimum: 0 },
          bedVolume: { type: "number", minimum: 0 },
          targetBedToTank: { type: "number", minimum: 0 },
          excludedBedVolume: { type: "number", minimum: 0 },
        },
        required: [
          "tankVolume",
          "bedVolume",
          "targetBedToTank",
          "excludedBedVolume",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          usableBedVolume: { type: "number" },
          observedRatio: { type: "number" },
          ratioGap: { type: "number" },
        },
        required: ["usableBedVolume", "observedRatio", "ratioGap"],
      },
      ports: {
        inputs: [
          {
            id: "tankVolume",
            label: "Tank Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "bedVolume",
            label: "Bed Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "targetBedToTank",
            label: "Target Bed To Tank",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "excludedBedVolume",
            label: "Excluded Bed Volume",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "usableBedVolume",
            label: "Usable Bed Volume",
            valueType: { type: "number" },
          },
          {
            id: "observedRatio",
            label: "Observed Ratio",
            valueType: { type: "number" },
          },
          { id: "ratioGap", label: "Ratio Gap", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  },
);
export const run = tankBedReferenceGapTool.execute;
export default tankBedReferenceGapTool;
