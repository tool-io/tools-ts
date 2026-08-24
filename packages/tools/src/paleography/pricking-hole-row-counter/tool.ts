import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PrickingHoleRowCounterInput = {
  readonly holesAlongTopEdge: number;
  readonly holesAlongBottomEdge: number;
};

export type PrickingHoleRowCounterOutput = {
  readonly averagePerEdge: number;
  readonly symmetryDelta: number;
  readonly alignmentVerdict: "symmetric" | "slightly_off" | "mismatched";
};

export const calculatePrickingHoleRowCounter = (
  input: PrickingHoleRowCounterInput,
): PrickingHoleRowCounterOutput => {
  for (const key of ["holesAlongTopEdge", "holesAlongBottomEdge"] as const) {
    if (!(Number.isSafeInteger(input[key]) && input[key] >= 1))
      return simpleError(
        key,
        "Pricking-hole counts must be positive integers.",
        "invalid_count",
      );
  }
  const symmetryDelta = Math.abs(
    input.holesAlongTopEdge - input.holesAlongBottomEdge,
  );
  return {
    averagePerEdge:
      input.holesAlongTopEdge / 2 + input.holesAlongBottomEdge / 2,
    symmetryDelta,
    alignmentVerdict:
      symmetryDelta === 0
        ? "symmetric"
        : symmetryDelta <= 2
          ? "slightly_off"
          : "mismatched",
  };
};

export const prickingHoleRowCounterExample = {
  input: { holesAlongTopEdge: 23, holesAlongBottomEdge: 23 },
  output: {
    averagePerEdge: 23,
    symmetryDelta: 0,
    alignmentVerdict: "symmetric",
  },
} satisfies ToolExample<
  PrickingHoleRowCounterInput,
  PrickingHoleRowCounterOutput
>;

export const prickingHoleRowCounterTool = createSimpleTool({
  id: "paleography/pricking-hole-row-counter",
  title: "Pricking Hole Row Counter",
  description:
    "Compare the pricking-hole counts on the top and bottom edges of a leaf with exact averages and the stated verdict bands (equal is symmetric, within two is slightly off, more is mismatched).",
  inputs: [
    {
      description: "Holes counted along the upper edge.",
      id: "holesAlongTopEdge",
      kind: "integer",
      label: "Top edge holes",
      minimum: 1,
    },
    {
      description: "Holes counted along the lower edge.",
      id: "holesAlongBottomEdge",
      kind: "integer",
      label: "Bottom edge holes",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Mean hole count of the two edges.",
      id: "averagePerEdge",
      kind: "number",
      label: "Average",
    },
    {
      description: "Absolute difference between the edges.",
      id: "symmetryDelta",
      kind: "integer",
      label: "Symmetry delta",
    },
    {
      description: "Stated-band alignment verdict.",
      id: "alignmentVerdict",
      enum: ["symmetric", "slightly_off", "mismatched"],
      kind: "string",
      label: "Alignment",
    },
  ],
  calculate: (input) =>
    calculatePrickingHoleRowCounter({
      holesAlongTopEdge: input.holesAlongTopEdge as number,
      holesAlongBottomEdge: input.holesAlongBottomEdge as number,
    }),
});

export const runPrickingHoleRowCounter = prickingHoleRowCounterTool.execute;
export default prickingHoleRowCounterTool;
