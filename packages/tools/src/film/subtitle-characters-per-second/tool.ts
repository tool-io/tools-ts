import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SubtitleCharactersPerSecondInput = Readonly<{
  readonly visibleCharacters: number;
  readonly durationSeconds: number;
}>;
export type SubtitleCharactersPerSecondOutput = Readonly<{
  readonly charactersPerSecond: number;
}>;

export const calculateSubtitleCharactersPerSecond = (
  x: SubtitleCharactersPerSecondInput,
): SubtitleCharactersPerSecondOutput => {
  if (!Number.isFinite(x.visibleCharacters) || x.visibleCharacters < 0)
    simpleError("visibleCharacters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.durationSeconds) || x.durationSeconds < 0)
    simpleError("durationSeconds", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.visibleCharacters))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const charactersPerSecond = x.visibleCharacters / x.durationSeconds;
  if (!Number.isFinite(charactersPerSecond))
    simpleError(
      "charactersPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    charactersPerSecond: Object.is(charactersPerSecond, -0)
      ? 0
      : charactersPerSecond,
  };
};

export const example = {
  input: { visibleCharacters: 36, durationSeconds: 3 },
  output: { charactersPerSecond: 12 },
} satisfies ToolExample<
  SubtitleCharactersPerSecondInput,
  SubtitleCharactersPerSecondOutput
>;

export const tool = createSimpleTool({
  id: "film/subtitle-characters-per-second",
  title: "Subtitle Characters Per Second",
  description:
    "Subtitle reading load as visible character count divided by the subtitle's on-screen duration.",
  inputs: [
    {
      id: "visibleCharacters",
      kind: "number",
      label: "Visible Characters",
      minimum: 0,
    },
    {
      id: "durationSeconds",
      kind: "number",
      label: "Duration Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "charactersPerSecond",
      kind: "number",
      label: "Characters Per Second",
      unit: "chars/s",
    },
  ],
  calculate: (input) =>
    calculateSubtitleCharactersPerSecond({
      visibleCharacters: input.visibleCharacters as number,
      durationSeconds: input.durationSeconds as number,
    }),
});
export const subtitleCharactersPerSecondTool = tool;
export const runSubtitleCharactersPerSecond = tool.execute;
export default tool;
