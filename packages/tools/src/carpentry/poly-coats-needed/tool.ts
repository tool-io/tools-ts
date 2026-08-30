import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PolyCoatsNeededInput = Readonly<{
  readonly targetDryFilmMicrons: number;
  readonly dryFilmPerCoatMicrons: number;
}>;
export type PolyCoatsNeededOutput = Readonly<{
  readonly coatCount: number;
}>;

export const calculatePolyCoatsNeeded = (
  x: PolyCoatsNeededInput,
): PolyCoatsNeededOutput => {
  if (!Number.isFinite(x.targetDryFilmMicrons) || x.targetDryFilmMicrons < 0)
    simpleError("targetDryFilmMicrons", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.dryFilmPerCoatMicrons) || x.dryFilmPerCoatMicrons < 0)
    simpleError("dryFilmPerCoatMicrons", "Provide a finite number at least 0.");
  if (!(x.dryFilmPerCoatMicrons > 0))
    simpleError("dryFilmPerCoatMicrons", "Per-coat build must be positive.");
  const coatCount = Math.ceil(x.targetDryFilmMicrons / x.dryFilmPerCoatMicrons);
  if (!Number.isFinite(coatCount) || !Number.isSafeInteger(coatCount))
    simpleError("coatCount", "The inputs produce an invalid result.");
  return { coatCount: Object.is(coatCount, -0) ? 0 : coatCount };
};

export const example = {
  input: { targetDryFilmMicrons: 60, dryFilmPerCoatMicrons: 20 },
  output: { coatCount: 3 },
} satisfies ToolExample<PolyCoatsNeededInput, PolyCoatsNeededOutput>;

export const tool = createSimpleTool({
  id: "carpentry/poly-coats-needed",
  title: "Poly Coats Needed",
  description:
    "Round up polyurethane finish coats from desired dry-film thickness and achievable dry-film build per coat.",
  inputs: [
    {
      id: "targetDryFilmMicrons",
      kind: "number",
      label: "Target dry-film build",
      unit: "µm",
      minimum: 0,
    },
    {
      id: "dryFilmPerCoatMicrons",
      kind: "number",
      label: "Dry-film build per coat",
      unit: "µm",
      minimum: 0,
    },
  ],
  outputs: [{ id: "coatCount", kind: "integer", label: "Coats required" }],
  calculate: (input) =>
    calculatePolyCoatsNeeded({
      targetDryFilmMicrons: input.targetDryFilmMicrons as number,
      dryFilmPerCoatMicrons: input.dryFilmPerCoatMicrons as number,
    }),
});
export const polyCoatsNeededTool = tool;
export const runPolyCoatsNeeded = tool.execute;
export default tool;
