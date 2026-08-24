import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DuctusComplexityIndexRaterInput = {
  readonly strokeCount: number;
  readonly lettersMeasured: number;
  readonly penLiftCount?: number;
};

export type DuctusComplexityIndexRaterOutput = {
  readonly strokesPerLetter: number;
  readonly penLiftsPerLetter: number;
  readonly ductusBand: "economical" | "moderate" | "complex";
};

export const calculateDuctusComplexityIndexRater = (
  input: DuctusComplexityIndexRaterInput,
): DuctusComplexityIndexRaterOutput => {
  if (!(Number.isSafeInteger(input.strokeCount) && input.strokeCount >= 1))
    return simpleError(
      "strokeCount",
      "Stroke count must be a positive integer.",
      "invalid_count",
    );
  if (!(
    Number.isSafeInteger(input.lettersMeasured) && input.lettersMeasured >= 1
  ))
    return simpleError(
      "lettersMeasured",
      "Measure at least one letter.",
      "invalid_count",
    );
  const penLiftCount = input.penLiftCount ?? 0;
  if (!(Number.isSafeInteger(penLiftCount) && penLiftCount >= 0))
    return simpleError(
      "penLiftCount",
      "Pen lift count must be a non-negative integer.",
      "invalid_count",
    );
  const strokesPerLetter = input.strokeCount / input.lettersMeasured;
  const penLiftsPerLetter = penLiftCount / input.lettersMeasured;
  return {
    strokesPerLetter,
    penLiftsPerLetter,
    ductusBand:
      strokesPerLetter < 3
        ? "economical"
        : strokesPerLetter <= 6
          ? "moderate"
          : "complex",
  };
};

export const ductusComplexityIndexRaterExample = {
  input: { strokeCount: 48, lettersMeasured: 10, penLiftCount: 12 },
  output: {
    strokesPerLetter: 4.8,
    penLiftsPerLetter: 1.2,
    ductusBand: "moderate",
  },
} satisfies ToolExample<
  DuctusComplexityIndexRaterInput,
  DuctusComplexityIndexRaterOutput
>;

export const ductusComplexityIndexRaterTool = createSimpleTool({
  id: "paleography/ductus-complexity-index-rater",
  title: "Ductus Complexity Index Rater",
  description:
    "Rate script ductus complexity under the stated rule: strokes per letter with bands economical (<3), moderate (3-6) and complex (>6), plus pen lifts per letter as a secondary index.",
  inputs: [
    {
      description: "Pen strokes counted across the sampled letters.",
      id: "strokeCount",
      kind: "integer",
      label: "Strokes",
      minimum: 1,
    },
    {
      description: "Letters in the measured sample.",
      id: "lettersMeasured",
      kind: "integer",
      label: "Letters",
      minimum: 1,
    },
    {
      default: 0,
      description: "Pen lifts (nib raised between strokes) in the sample.",
      id: "penLiftCount",
      kind: "integer",
      label: "Pen lifts",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Strokes divided by letters.",
      id: "strokesPerLetter",
      kind: "number",
      label: "Strokes/letter",
    },
    {
      description: "Pen lifts divided by letters.",
      id: "penLiftsPerLetter",
      kind: "number",
      label: "Lifts/letter",
    },
    {
      description: "Ductus band from the stated thresholds.",
      id: "ductusBand",
      enum: ["economical", "moderate", "complex"],
      kind: "string",
      label: "Ductus band",
    },
  ],
  calculate: (input) =>
    calculateDuctusComplexityIndexRater({
      lettersMeasured: input.lettersMeasured as number,
      penLiftCount: input.penLiftCount as number | undefined,
      strokeCount: input.strokeCount as number,
    }),
});

export const runDuctusComplexityIndexRater =
  ductusComplexityIndexRaterTool.execute;
export default ductusComplexityIndexRaterTool;
