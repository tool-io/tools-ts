import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GraceNoteDurationSubtractionInput = Readonly<{
  readonly mainNoteSeconds: number;
  readonly graceSeconds: number;
}>;
export type GraceNoteDurationSubtractionOutput = Readonly<{
  readonly remainingMainSeconds: number;
}>;

export const calculateGraceNoteDurationSubtraction = (
  x: GraceNoteDurationSubtractionInput,
): GraceNoteDurationSubtractionOutput => {
  if (!Number.isFinite(x.mainNoteSeconds) || x.mainNoteSeconds <= 0)
    simpleError("mainNoteSeconds", "Provide a finite positive number.");
  if (!Number.isFinite(x.graceSeconds) || x.graceSeconds < 0)
    simpleError("graceSeconds", "Provide a finite nonnegative number.");
  if (!(x.graceSeconds <= x.mainNoteSeconds))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const remainingMainSeconds = x.mainNoteSeconds - x.graceSeconds;
  if (!Number.isFinite(remainingMainSeconds))
    simpleError(
      "remainingMainSeconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    remainingMainSeconds: Object.is(remainingMainSeconds, -0)
      ? 0
      : remainingMainSeconds,
  };
};

export const example = {
  input: {
    mainNoteSeconds: 1,
    graceSeconds: 0.1,
  },
  output: { remainingMainSeconds: 0.9 },
} satisfies ToolExample<
  GraceNoteDurationSubtractionInput,
  GraceNoteDurationSubtractionOutput
>;

export const tool = createSimpleTool({
  id: "music/grace-note-duration-subtraction",
  title: "Grace Note Duration Subtraction",
  description:
    "Remaining duration of a main note when a grace note borrows a specified number of seconds from it.",
  inputs: [
    {
      id: "mainNoteSeconds",
      kind: "number",
      label: "Main Note Seconds",
      unit: "s",
      minimum: 0,
    },
    {
      id: "graceSeconds",
      kind: "number",
      label: "Grace Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "remainingMainSeconds",
      kind: "number",
      label: "Remaining Main Seconds",
      unit: "s",
    },
  ],
  calculate: (input) =>
    calculateGraceNoteDurationSubtraction({
      mainNoteSeconds: input.mainNoteSeconds as number,
      graceSeconds: input.graceSeconds as number,
    }),
});
export const graceNoteDurationSubtractionTool = tool;
export const runGraceNoteDurationSubtraction = tool.execute;
export default tool;
