import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly areas: readonly number[];
  readonly pairOverlaps: readonly number[];
  readonly tripleOverlap: number;
  readonly plotArea: number;
};
export type Output = {
  readonly unionArea: number;
  readonly remainingArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areas: { type: "array", maxItems: 256, items: { type: "number" } },
    pairOverlaps: { type: "array", maxItems: 256, items: { type: "number" } },
    tripleOverlap: { type: "number", minimum: 0 },
    plotArea: { type: "number", minimum: 0 },
  },
  required: ["areas", "pairOverlaps", "tripleOverlap", "plotArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unionArea: { type: "number" },
    remainingArea: { type: "number" },
  },
  required: ["unionArea", "remainingArea"],
} as const;
/** Three-canopy inclusion-exclusion from supplied pair and triple overlaps. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { areas, pairOverlaps, tripleOverlap, plotArea } = request;
  const compute = (): Output => {
    H.domain(
      areas.length === 3 &&
        pairOverlaps.length === 3 &&
        areas.every((x) => x >= 0) &&
        pairOverlaps.every((x) => x >= 0) &&
        tripleOverlap >= 0 &&
        pairOverlaps.every((x) => tripleOverlap <= x) &&
        pairOverlaps[0] <= Math.min(areas[0], areas[1]) &&
        pairOverlaps[1] <= Math.min(areas[0], areas[2]) &&
        pairOverlaps[2] <= Math.min(areas[1], areas[2]) &&
        areas[0] >= pairOverlaps[0] + pairOverlaps[1] - tripleOverlap &&
        areas[1] >= pairOverlaps[0] + pairOverlaps[2] - tripleOverlap &&
        areas[2] >= pairOverlaps[1] + pairOverlaps[2] - tripleOverlap &&
        plotArea >= 0,
    );
    return {
      unionArea:
        areas.reduce((a, b) => a + b, 0) -
        pairOverlaps.reduce((a, b) => a + b, 0) +
        tripleOverlap,
      remainingArea:
        plotArea -
        areas.reduce((a, b) => a + b, 0) +
        pairOverlaps.reduce((a, b) => a + b, 0) -
        tripleOverlap,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    areas: [20, 30, 40],
    pairOverlaps: [5, 6, 7],
    tripleOverlap: 2,
    plotArea: 100,
  },
  output: { unionArea: 74, remainingArea: 26 },
} satisfies ToolExample<Input, Output>;
export const guildPlantCanopyOverlapBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "permaculture/guild-plant-canopy-overlap-budget",
    title: "Guild Plant Canopy Overlap Budget Tool",
    description:
      "Three-canopy inclusion-exclusion from supplied pair and triple overlaps.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        areas: { type: "array", maxItems: 256, items: { type: "number" } },
        pairOverlaps: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        tripleOverlap: { type: "number", minimum: 0 },
        plotArea: { type: "number", minimum: 0 },
      },
      required: ["areas", "pairOverlaps", "tripleOverlap", "plotArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unionArea: { type: "number" },
        remainingArea: { type: "number" },
      },
      required: ["unionArea", "remainingArea"],
    },
    ports: {
      inputs: [
        {
          id: "areas",
          label: "Areas",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "pairOverlaps",
          label: "Pair Overlaps",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "tripleOverlap",
          label: "Triple Overlap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plotArea",
          label: "Plot Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "unionArea", label: "Union Area", valueType: { type: "number" } },
        {
          id: "remainingArea",
          label: "Remaining Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = guildPlantCanopyOverlapBudgetTool.execute;
export default guildPlantCanopyOverlapBudgetTool;
