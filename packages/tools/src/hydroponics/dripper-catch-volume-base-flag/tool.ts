import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly catchVolumes: readonly number[];
  readonly collectionMinutes: number;
  readonly excluded: readonly boolean[];
  readonly excludeMarked: boolean;
};
export type Output = {
  readonly reportedVolume: number;
  readonly includedCount: number;
  readonly meanFlow: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    catchVolumes: { type: "array", maxItems: 256, items: { type: "number" } },
    collectionMinutes: { type: "number", exclusiveMinimum: 0 },
    excluded: { type: "array", maxItems: 256, items: { type: "boolean" } },
    excludeMarked: { type: "boolean" },
  },
  required: ["catchVolumes", "collectionMinutes", "excluded", "excludeMarked"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedVolume: { type: "number" },
    includedCount: { type: "integer" },
    meanFlow: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["reportedVolume", "includedCount", "meanFlow", "defined"],
} as const;
/** Calculate dripper catch volume base flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { catchVolumes, collectionMinutes, excluded, excludeMarked } = request;
  const compute = (): Output => {
    H.sameLength(catchVolumes, excluded);
    H.domain(catchVolumes.every((x) => x >= 0));
    H.positive(collectionMinutes);
    return {
      reportedVolume: catchVolumes.reduce(
        (a, b, i) => a + (!excludeMarked || !excluded[i] ? b : 0),
        0,
      ),
      includedCount: catchVolumes.filter(
        (_, i) => !excludeMarked || !excluded[i],
      ).length,
      meanFlow:
        catchVolumes.filter((_, i) => !excludeMarked || !excluded[i]).length > 0
          ? catchVolumes.reduce(
              (a, b, i) => a + (!excludeMarked || !excluded[i] ? b : 0),
              0,
            ) /
            catchVolumes.filter((_, i) => !excludeMarked || !excluded[i])
              .length /
            collectionMinutes
          : 0,
      defined: catchVolumes.some((_, i) => !excludeMarked || !excluded[i]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    catchVolumes: [10, 20, 30],
    collectionMinutes: 2,
    excluded: [false, true, false],
    excludeMarked: true,
  },
  output: { reportedVolume: 40, includedCount: 2, meanFlow: 10, defined: true },
} satisfies ToolExample<Input, Output>;
export const dripperCatchVolumeBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydroponics/dripper-catch-volume-base-flag",
    title: "Dripper Catch Volume Base Flag Tool",
    description:
      "Calculate dripper catch volume base flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        catchVolumes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        collectionMinutes: { type: "number", exclusiveMinimum: 0 },
        excluded: { type: "array", maxItems: 256, items: { type: "boolean" } },
        excludeMarked: { type: "boolean" },
      },
      required: [
        "catchVolumes",
        "collectionMinutes",
        "excluded",
        "excludeMarked",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedVolume: { type: "number" },
        includedCount: { type: "integer" },
        meanFlow: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["reportedVolume", "includedCount", "meanFlow", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "catchVolumes",
          label: "Catch Volumes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "collectionMinutes",
          label: "Collection Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excluded",
          label: "Excluded",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "excludeMarked",
          label: "Exclude Marked",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "reportedVolume",
          label: "Reported Volume",
          valueType: { type: "number" },
        },
        {
          id: "includedCount",
          label: "Included Count",
          valueType: { type: "integer" },
        },
        { id: "meanFlow", label: "Mean Flow", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = dripperCatchVolumeBaseFlagTool.execute;
export default dripperCatchVolumeBaseFlagTool;
