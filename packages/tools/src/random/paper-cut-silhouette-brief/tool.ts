import { calculateWordWrap } from "../../text/word-wrap/tool.js";
import {
  createModelDefinition,
  matchesModelInput,
  inputObject,
  outputObject,
  array,
  positive,
  nonnegative,
  integer,
  object,
  label,
  strings,
  run,
  pick,
  finite,
  simpleError,
  type AcSeed,
  type AcReplay,
  type ToolExample,
  type ToolExecutionContext,
} from "../m500b-art-craft-common.js";
export type PaperCutSilhouetteBriefInput = AcSeed & {
  readonly motifs: readonly string[];
  readonly negativeSpaces: readonly string[];
  readonly width: number;
  readonly height: number;
  readonly border: number;
  readonly minimumBridgeWidth: number;
  readonly wrapWidth: number;
  readonly count: number;
};
export type PaperCutSilhouetteBriefOutput = AcReplay & {
  readonly briefs: readonly {
    readonly motif: string;
    readonly negativeSpace: string;
    readonly usableWidth: number;
    readonly usableHeight: number;
    readonly minimumBridgeWidth: number;
    readonly wrappedText: string;
    readonly lineCount: number;
  }[];
};
export const inputSchema = inputObject({
  motifs: strings,
  negativeSpaces: strings,
  width: positive,
  height: positive,
  border: nonnegative,
  minimumBridgeWidth: positive,
  wrapWidth: integer(1, 256),
  count: integer(1, 16),
});
export const outputSchema = outputObject({
  briefs: array(
    object({
      motif: label,
      negativeSpace: label,
      usableWidth: positive,
      usableHeight: positive,
      minimumBridgeWidth: positive,
      wrappedText: { type: "string", maxLength: 2048 },
      lineCount: integer(1, 256),
    }),
    16,
    1,
  ),
});
const isInput = (v: unknown): v is PaperCutSilhouetteBriefInput =>
  matchesModelInput(v, inputSchema);
export const calculatePaperCutSilhouetteBrief = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<PaperCutSilhouetteBriefOutput, "randomness"> => {
      const usableWidth = finite(x.width - 2 * x.border),
        usableHeight = finite(x.height - 2 * x.border);
      if (
        usableWidth <= 0 ||
        usableHeight <= 0 ||
        x.minimumBridgeWidth > Math.min(usableWidth, usableHeight)
      )
        return simpleError(
          "border",
          "The interior must fit at least one minimum-width bridge.",
          "invalid_interior",
        );
      return {
        briefs: Array.from({ length: x.count }, () => {
          const motif = pick(x.motifs, random),
            negativeSpace = pick(x.negativeSpaces, random),
            text = `Motif: ${motif}. Negative space: ${negativeSpace}. Interior: ${usableWidth} x ${usableHeight}. Minimum bridge: ${x.minimumBridgeWidth}.`;
          return {
            motif,
            negativeSpace,
            usableWidth,
            usableHeight,
            minimumBridgeWidth: x.minimumBridgeWidth,
            ...calculateWordWrap({ text, width: x.wrapWidth }),
          };
        }),
      };
    },
  );
export const paperCutSilhouetteBriefExample = {
  input: {
    motifs: ["leaf"],
    negativeSpaces: ["window"],
    width: 12,
    height: 8,
    border: 1,
    minimumBridgeWidth: 0.5,
    wrapWidth: 120,
    count: 1,
    seed: 42,
  },
  output: {
    briefs: [
      {
        motif: "leaf",
        negativeSpace: "window",
        usableWidth: 10,
        usableHeight: 6,
        minimumBridgeWidth: 0.5,
        wrappedText:
          "Motif: leaf. Negative space: window. Interior: 10 x 6. Minimum bridge: 0.5.",
        lineCount: 1,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  PaperCutSilhouetteBriefInput,
  PaperCutSilhouetteBriefOutput
>;
export const paperCutSilhouetteBriefTool = createModelDefinition<
  PaperCutSilhouetteBriefInput,
  PaperCutSilhouetteBriefOutput
>({
  id: "random/paper-cut-silhouette-brief",
  title: "Random Paper Cut Silhouette Brief Generator",
  description:
    "Compose supplied motif and negative-space constraints into dimensioned word-wrapped design briefs; cutting technique and tool safety remain external.",
  inputSchema,
  outputSchema,
  execute: calculatePaperCutSilhouetteBrief,
});
export const runPaperCutSilhouetteBrief = paperCutSilhouetteBriefTool.execute;
export default paperCutSilhouetteBriefTool;
