import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SchwabacherFrakturNoteGeneratorInput = {
  readonly loopedAscenderCount: number;
  readonly straightAscenderCount: number;
};

export type SchwabacherFrakturNoteGeneratorOutput = {
  readonly frakturAffinityPct: number;
  readonly verdict: "schwabacher_leaning" | "mixed" | "fraktur_leaning";
  readonly note: string;
};

export const calculateSchwabacherFrakturNoteGenerator = (
  input: SchwabacherFrakturNoteGeneratorInput,
): SchwabacherFrakturNoteGeneratorOutput => {
  for (const key of ["loopedAscenderCount", "straightAscenderCount"] as const) {
    if (!(Number.isSafeInteger(input[key]) && input[key] >= 0))
      return simpleError(
        key,
        "Ascender counts must be non-negative safe integers.",
        "invalid_counts",
      );
  }
  const totalAscenders =
    input.loopedAscenderCount + input.straightAscenderCount;
  if (!Number.isSafeInteger(totalAscenders))
    return simpleError(
      "loopedAscenderCount",
      "The total ascender count exceeds the safe integer range.",
      "numeric_overflow",
    );
  if (totalAscenders === 0)
    return simpleError(
      "loopedAscenderCount",
      "Sample at least one ascender before generating a verdict.",
      "invalid_counts",
    );
  const affinityPct = (input.loopedAscenderCount / totalAscenders) * 100;
  const verdict =
    affinityPct > 60
      ? "fraktur_leaning"
      : affinityPct < 40
        ? "schwabacher_leaning"
        : "mixed";
  const note = `Verdict: ${verdict} (${input.loopedAscenderCount} looped vs ${input.straightAscenderCount} straight of ${totalAscenders} sampled ascenders). Looped ascenders indicate Fraktur; unlooped straight ascenders indicate Schwabacher.`;
  return { frakturAffinityPct: affinityPct, note, verdict };
};

export const schwabacherFrakturNoteGeneratorExample = {
  input: { loopedAscenderCount: 14, straightAscenderCount: 6 },
  output: {
    frakturAffinityPct: 70,
    note: "Verdict: fraktur_leaning (14 looped vs 6 straight of 20 sampled ascenders). Looped ascenders indicate Fraktur; unlooped straight ascenders indicate Schwabacher.",
    verdict: "fraktur_leaning",
  },
} satisfies ToolExample<
  SchwabacherFrakturNoteGeneratorInput,
  SchwabacherFrakturNoteGeneratorOutput
>;

export const schwabacherFrakturNoteGeneratorTool = createSimpleTool({
  id: "paleography/schwabacher-fraktur-note-generator",
  title: "Schwabacher Fraktur Note Generator",
  description:
    "Generate a dated-note-style verdict for late Gothic textura under the stated heuristic on sampled ascender forms: more than 60 percent looped ascenders leans Fraktur, under 40 percent leans Schwabacher, and anything between is mixed.",
  inputs: [
    {
      description: "Sampled ascenders drawn with Fraktur-style loops.",
      id: "loopedAscenderCount",
      kind: "integer",
      label: "Looped ascenders",
      minimum: 0,
    },
    {
      description:
        "Sampled ascenders left unlooped and pointed (Schwabacher trait).",
      id: "straightAscenderCount",
      kind: "integer",
      label: "Straight ascenders",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Looped ascenders as a percentage of all sampled ascenders.",
      id: "frakturAffinityPct",
      kind: "number",
      label: "Fraktur affinity %",
    },
    {
      description: "Stated-heuristic verdict from the ascender tally.",
      id: "verdict",
      enum: ["schwabacher_leaning", "mixed", "fraktur_leaning"],
      kind: "string",
      label: "Verdict",
    },
    {
      description: "Plain-language note recording the tally and its reading.",
      id: "note",
      kind: "string",
      label: "Note",
    },
  ],
  calculate: (input) =>
    calculateSchwabacherFrakturNoteGenerator({
      loopedAscenderCount: input.loopedAscenderCount as number,
      straightAscenderCount: input.straightAscenderCount as number,
    }),
});

export const runSchwabacherFrakturNoteGenerator =
  schwabacherFrakturNoteGeneratorTool.execute;
export default schwabacherFrakturNoteGeneratorTool;
