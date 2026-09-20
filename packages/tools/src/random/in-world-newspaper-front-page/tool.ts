import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import { simpleError } from "../../core/simple.js";
import { calculateWordWrap } from "../../text/word-wrap/tool.js";
import {
  fcArray,
  fcBoolean,
  fcId,
  fcInput,
  fcInteger,
  fcObject,
  fcOutput,
  fcPick,
  fcRun,
  fcText,
  fcUnique,
  matchesModelInput,
  type FcReplay,
  type FcSeed,
} from "../m250-fiction-craft-common.js";
export type InWorldNewspaperFrontPageInput = FcSeed & {
  readonly newspaper: string;
  readonly slotCount: number;
  readonly stories: readonly {
    readonly id: string;
    readonly headline: string;
    readonly excerpt: string;
  }[];
  readonly bylines: readonly string[];
  readonly headlineLimit: number;
  readonly excerptLimit: number;
  readonly wrapWidth: number;
};
export type InWorldNewspaperFrontPageOutput = FcReplay & {
  readonly fictional: boolean;
  readonly newspaper: string;
  readonly slots: readonly {
    readonly slot: number;
    readonly storyId: string;
    readonly headline: string;
    readonly excerpt: string;
    readonly byline: string;
    readonly headlineTruncated: boolean;
    readonly excerptTruncated: boolean;
    readonly wrappedExcerpt: string;
    readonly lineCount: number;
  }[];
};
export const inputSchema = fcInput({
  newspaper: fcText,
  slotCount: fcInteger(1, 32),
  stories: fcArray(
    fcObject({ id: fcId, headline: fcText, excerpt: fcText }),
    64,
    1,
  ),
  bylines: fcArray(fcText, 32, 1),
  headlineLimit: fcInteger(0, 2048),
  excerptLimit: fcInteger(0, 2048),
  wrapWidth: fcInteger(1, 2048),
});
export const outputSchema = fcOutput({
  fictional: { type: "boolean", const: true },
  newspaper: fcText,
  slots: fcArray(
    fcObject({
      slot: fcInteger(1, 32),
      storyId: fcId,
      headline: fcText,
      excerpt: fcText,
      byline: fcText,
      headlineTruncated: fcBoolean,
      excerptTruncated: fcBoolean,
      wrappedExcerpt: fcText,
      lineCount: fcInteger(0, 2048),
    }),
    32,
    1,
  ),
});
const isInput = (v: unknown): v is InWorldNewspaperFrontPageInput =>
  matchesModelInput(v, inputSchema);
const clip = (text: string, limit: number): string => {
  let end = Math.min(limit, text.length);
  if (
    end < text.length &&
    end > 0 &&
    /[\uD800-\uDBFF]/u.test(text.charAt(end - 1)) &&
    /[\uDC00-\uDFFF]/u.test(text.charAt(end))
  )
    end--;
  return text.slice(0, end);
};
export const calculateInWorldNewspaperFrontPage = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  fcRun(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<InWorldNewspaperFrontPageOutput, "randomness"> => {
      fcUnique(
        x.stories.map((s) => s.id),
        "stories",
      );
      if (x.slotCount > x.stories.length)
        simpleError(
          "slotCount",
          "Supply a distinct story for every page slot.",
          "infeasible_slot_count",
        );
      const pool = [...x.stories],
        slots = Array.from({ length: x.slotCount }, (_, index) => {
          const story = fcPick(pool, random);
          pool.splice(pool.indexOf(story), 1);
          const headline = clip(story.headline, x.headlineLimit),
            excerpt = clip(story.excerpt, x.excerptLimit),
            wrapped = calculateWordWrap({ text: excerpt, width: x.wrapWidth });
          return {
            slot: index + 1,
            storyId: story.id,
            headline,
            excerpt,
            byline: fcPick(x.bylines, random),
            headlineTruncated: headline !== story.headline,
            excerptTruncated: excerpt !== story.excerpt,
            wrappedExcerpt: wrapped.wrappedText,
            lineCount: wrapped.lineCount,
          };
        });
      return { fictional: true, newspaper: x.newspaper, slots };
    },
  );
export const inWorldNewspaperFrontPageExample = {
  input: {
    newspaper: "Reedport Gazette",
    slotCount: 2,
    stories: [
      {
        id: "ferry",
        headline: "Ferry resumes service",
        excerpt: "Boats cross at dawn",
      },
      {
        id: "lantern",
        headline: "Harbor lantern restored",
        excerpt: "Light returns to the quay",
      },
    ],
    bylines: ["Mira Vale", "Orin Reed"],
    headlineLimit: 12,
    excerptLimit: 25,
    wrapWidth: 12,
    seed: 42,
  },
  output: {
    fictional: true,
    newspaper: "Reedport Gazette",
    slots: [
      {
        slot: 1,
        storyId: "lantern",
        headline: "Harbor lante",
        excerpt: "Light returns to the quay",
        byline: "Mira Vale",
        headlineTruncated: true,
        excerptTruncated: false,
        wrappedExcerpt: "Light\nreturns to\nthe quay",
        lineCount: 3,
      },
      {
        slot: 2,
        storyId: "ferry",
        headline: "Ferry resume",
        excerpt: "Boats cross at dawn",
        byline: "Orin Reed",
        headlineTruncated: true,
        excerptTruncated: false,
        wrappedExcerpt: "Boats cross\nat dawn",
        lineCount: 2,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  InWorldNewspaperFrontPageInput,
  InWorldNewspaperFrontPageOutput
>;
export const inWorldNewspaperFrontPageTool = createModelDefinition<
  InWorldNewspaperFrontPageInput,
  InWorldNewspaperFrontPageOutput
>({
  id: "random/in-world-newspaper-front-page",
  title: "Random In-World Newspaper Front Page Generator",
  description:
    "Fill fictional newspaper slots from distinct supplied stories and bylines with UTF-16 text budgets, truncation flags, and greedy excerpt wrapping.",
  inputSchema,
  outputSchema,
  execute: calculateInWorldNewspaperFrontPage,
});
export const runInWorldNewspaperFrontPage =
  inWorldNewspaperFrontPageTool.execute;
export default inWorldNewspaperFrontPageTool;
