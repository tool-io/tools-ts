import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ArchetypalResult = {
  readonly archetypeIndices: readonly number[];
  readonly archetypes: readonly (readonly number[])[];
  readonly assignments: readonly number[];
  readonly reconstructionError: number;
};
const squaredDistance = (first: readonly number[], second: readonly number[]) =>
  first.reduce((sum, value, index) => sum + (value - second[index]!) ** 2, 0);
export const demonstrateArchetypalAnalysis = (
  data: readonly (readonly number[])[],
  archetypeCount: number,
): ArchetypalResult | null => {
  const dimensions = data[0]?.length ?? 0;
  if (
    data.length < 2 ||
    !dimensions ||
    archetypeCount > data.length ||
    data.some((point) => point.length !== dimensions)
  )
    return null;
  const centroid = data[0]!.map(
      (_, dimension) =>
        data.reduce((sum, point) => sum + point[dimension]!, 0) / data.length,
    ),
    selected: number[] = [];
  while (selected.length < archetypeCount) {
    let best = -1,
      bestDistance = -Infinity;
    for (let index = 0; index < data.length; index += 1)
      if (!selected.includes(index)) {
        const distance = selected.length
          ? Math.min(
              ...selected.map((candidate) =>
                squaredDistance(data[index]!, data[candidate]!),
              ),
            )
          : squaredDistance(data[index]!, centroid);
        if (distance > bestDistance) {
          best = index;
          bestDistance = distance;
        }
      }
    selected.push(best);
  }
  const assignments = data.map((point) =>
    selected.reduce(
      (best, candidate, index) =>
        squaredDistance(point, data[candidate]!) <
        squaredDistance(point, data[selected[best]!]!)
          ? index
          : best,
      0,
    ),
  );
  const error = Math.sqrt(
    data.reduce(
      (sum, point, index) =>
        sum + squaredDistance(point, data[selected[assignments[index]!]!]!),
      0,
    ) / data.length,
  );
  return {
    archetypeIndices: selected,
    archetypes: selected.map((index) => data[index]!),
    assignments,
    reconstructionError: Number(error.toPrecision(12)),
  };
};
export const archetypalAnalysisExample = {
  input: {
    archetypeCount: 2,
    data: [
      [0, 0],
      [1, 1],
      [10, 10],
    ],
  },
  output: {
    result: {
      archetypeIndices: [2, 0],
      archetypes: [
        [10, 10],
        [0, 0],
      ],
      assignments: [1, 1, 0],
      reconstructionError: 0.816496580928,
    },
  },
} satisfies ToolExample<
  {
    readonly archetypeCount: number;
    readonly data: readonly (readonly number[])[];
  },
  { readonly result: ArchetypalResult }
>;
export const archetypalAnalysisTool = createSimpleTool({
  id: "data-analysis/archetypal-analysis",
  title: "Archetypal Analysis Demonstrator",
  description:
    "Select representative boundary observations with a deterministic farthest-first archetype initialization.",
  inputs: [
    {
      format: "matrix/observations",
      id: "data",
      kind: "matrix",
      label: "Observations",
    },
    {
      id: "archetypeCount",
      kind: "integer",
      label: "Archetypes",
      maximum: 100,
      minimum: 1,
    },
  ],
  outputs: [
    {
      format: "data-analysis/archetypes",
      id: "result",
      kind: "object",
      label: "Archetypes",
    },
  ],
  calculate: (input) => {
    const result = demonstrateArchetypalAnalysis(
      input.data as number[][],
      input.archetypeCount as number,
    );
    if (!result)
      return simpleError(
        "data",
        "Enter a rectangular dataset and no more archetypes than observations.",
      );
    return { result };
  },
});
export const runArchetypalAnalysis = archetypalAnalysisTool.execute;
export default archetypalAnalysisTool;
