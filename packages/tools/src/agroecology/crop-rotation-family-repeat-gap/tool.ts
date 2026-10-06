import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousSeasonIndex: number;
  readonly currentSeasonIndex: number;
};
export type Output = {
  readonly seasonDifference: number;
  readonly interveningSeasons: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousSeasonIndex: { type: "integer", minimum: 0 },
    currentSeasonIndex: { type: "integer" },
  },
  required: ["previousSeasonIndex", "currentSeasonIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seasonDifference: { type: "integer" },
    interveningSeasons: { type: "integer" },
  },
  required: ["seasonDifference", "interveningSeasons"],
} as const;
/** Count explicit season-index distance and strictly intervening seasons for a supplied repeated crop family. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousSeasonIndex, currentSeasonIndex } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(previousSeasonIndex) &&
        previousSeasonIndex >= 0 &&
        previousSeasonIndex <= Number.MAX_SAFE_INTEGER,
      "previousSeasonIndex",
    ),
      previousSeasonIndex);
    (H.domain(
      Number.isSafeInteger(currentSeasonIndex) &&
        currentSeasonIndex >= previousSeasonIndex &&
        currentSeasonIndex <= Number.MAX_SAFE_INTEGER,
      "currentSeasonIndex",
    ),
      currentSeasonIndex);
    return {
      seasonDifference: currentSeasonIndex - previousSeasonIndex,
      interveningSeasons: Math.max(
        0,
        currentSeasonIndex - previousSeasonIndex - 1,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousSeasonIndex: 3, currentSeasonIndex: 7 },
  output: { seasonDifference: 4, interveningSeasons: 3 },
} satisfies ToolExample<Input, Output>;
export const cropRotationFamilyRepeatGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroecology", "agriculture"],
      keywords: ["agroecology", "agriculture"],
    },
    id: "agroecology/crop-rotation-family-repeat-gap",
    title: "Crop Rotation Family Repeat Gap",
    description:
      "Count explicit season-index distance and strictly intervening seasons for a supplied repeated crop family.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousSeasonIndex: { type: "integer", minimum: 0 },
        currentSeasonIndex: { type: "integer" },
      },
      required: ["previousSeasonIndex", "currentSeasonIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        seasonDifference: { type: "integer" },
        interveningSeasons: { type: "integer" },
      },
      required: ["seasonDifference", "interveningSeasons"],
    },
    ports: {
      inputs: [
        {
          id: "previousSeasonIndex",
          label: "Previous Season Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "currentSeasonIndex",
          label: "Current Season Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "seasonDifference",
          label: "Season Difference",
          valueType: { type: "integer" },
        },
        {
          id: "interveningSeasons",
          label: "Intervening Seasons",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = cropRotationFamilyRepeatGapTool.execute;
export default cropRotationFamilyRepeatGapTool;
