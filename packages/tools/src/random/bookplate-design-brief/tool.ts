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
export type BookplateDesignBriefInput = AcSeed & {
  readonly owners: readonly string[];
  readonly typography: readonly string[];
  readonly borders: readonly string[];
  readonly emblems: readonly string[];
  readonly width: number;
  readonly height: number;
  readonly inset: number;
  readonly wrapWidth: number;
  readonly count: number;
};
export type BookplateDesignBriefOutput = AcReplay & {
  readonly specifications: readonly {
    readonly owner: string;
    readonly typography: string;
    readonly border: string;
    readonly emblem: string;
    readonly usableWidth: number;
    readonly usableHeight: number;
    readonly wrappedText: string;
    readonly lineCount: number;
  }[];
};
export const inputSchema = inputObject({
  owners: strings,
  typography: strings,
  borders: strings,
  emblems: strings,
  width: positive,
  height: positive,
  inset: nonnegative,
  wrapWidth: integer(1, 256),
  count: integer(1, 16),
});
export const outputSchema = outputObject({
  specifications: array(
    object({
      owner: label,
      typography: label,
      border: label,
      emblem: label,
      usableWidth: positive,
      usableHeight: positive,
      wrappedText: { type: "string", maxLength: 2048 },
      lineCount: integer(1, 256),
    }),
    16,
    1,
  ),
});
const isInput = (v: unknown): v is BookplateDesignBriefInput =>
  matchesModelInput(v, inputSchema);
export const calculateBookplateDesignBrief = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<BookplateDesignBriefOutput, "randomness"> => {
      const usableWidth = finite(x.width - 2 * x.inset),
        usableHeight = finite(x.height - 2 * x.inset);
      if (usableWidth <= 0 || usableHeight <= 0)
        return simpleError(
          "inset",
          "Inset must leave a positive design interior.",
          "invalid_interior",
        );
      const specifications = Array.from({ length: x.count }, () => {
        const owner = pick(x.owners, random),
          typography = pick(x.typography, random),
          border = pick(x.borders, random),
          emblem = pick(x.emblems, random),
          text = `Owner: ${owner}. Type: ${typography}. Border: ${border}. Emblem: ${emblem}. Interior: ${usableWidth} x ${usableHeight}.`;
        return {
          owner,
          typography,
          border,
          emblem,
          usableWidth,
          usableHeight,
          ...calculateWordWrap({ text, width: x.wrapWidth }),
        };
      });
      return { specifications };
    },
  );
export const bookplateDesignBriefExample = {
  input: {
    owners: ["Ada"],
    typography: ["serif"],
    borders: ["line"],
    emblems: ["owl"],
    width: 8,
    height: 6,
    inset: 1,
    wrapWidth: 100,
    count: 1,
    seed: 42,
  },
  output: {
    specifications: [
      {
        owner: "Ada",
        typography: "serif",
        border: "line",
        emblem: "owl",
        usableWidth: 6,
        usableHeight: 4,
        wrappedText:
          "Owner: Ada. Type: serif. Border: line. Emblem: owl. Interior: 6 x 4.",
        lineCount: 1,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<BookplateDesignBriefInput, BookplateDesignBriefOutput>;
export const bookplateDesignBriefTool = createModelDefinition<
  BookplateDesignBriefInput,
  BookplateDesignBriefOutput
>({
  id: "random/bookplate-design-brief",
  title: "Random Bookplate Design Brief Generator",
  description:
    "Sample supplied owner, typography, border and emblem labels into dimensioned fictional bookplate briefs with greedy wrapping; typography metrics and artwork remain external.",
  inputSchema,
  outputSchema,
  execute: calculateBookplateDesignBrief,
});
export const runBookplateDesignBrief = bookplateDesignBriefTool.execute;
export default bookplateDesignBriefTool;
