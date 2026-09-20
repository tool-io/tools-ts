import {
  createModelDefinition,
  matchesModelInput,
  nInput,
  nOutput,
  nArray,
  nObject,
  nId,
  nText,
  nTags,
  nStringList,
  nInt,
  nWidth,
  nWrapped,
  nWrap,
  nPick,
  nSample,
  nDistinct,
  nRun,
  type NSeed,
  type NReplay,
  type NWrapped,
  type ToolExecutionContext,
  type ToolResult,
  type ToolExample,
} from "../m500b-narrative-support.js";
export type AlternateEndingComparisonInput = NSeed & {
  readonly premises: readonly string[];
  readonly endings: readonly {
    readonly id: string;
    readonly text: string;
    readonly consequenceTags: readonly string[];
  }[];
  readonly count: number;
  readonly wrapWidth: number;
};
export type AlternateEndingComparisonOutput = NReplay & {
  readonly premise: NWrapped;
  readonly endings: readonly {
    readonly id: string;
    readonly body: NWrapped;
    readonly consequenceTags: readonly string[];
  }[];
  readonly comparison: readonly {
    readonly tag: string;
    readonly endingIds: readonly string[];
  }[];
};
export const inputSchema = nInput({
  premises: nStringList,
  endings: nArray(
    nObject({ id: nId, text: nText, consequenceTags: nTags }),
    16,
    2,
  ),
  count: nInt(2, 16),
  wrapWidth: nWidth,
});
export const outputSchema = nOutput({
  premise: nWrapped,
  endings: nArray(
    nObject({ id: nId, body: nWrapped, consequenceTags: nTags }),
    16,
    2,
  ),
  comparison: nArray(nObject({ tag: nId, endingIds: nArray(nId, 16, 1) }), 256),
});
const isInput = (v: unknown): v is AlternateEndingComparisonInput =>
  matchesModelInput(v, inputSchema);
export const calculateAlternateEndingComparison = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<AlternateEndingComparisonOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    nDistinct(
      x.endings.map((e) => e.id),
      "endings",
    );
    for (const e of x.endings)
      nDistinct(e.consequenceTags, "endings.consequenceTags");
    const premise = nWrap(nPick(x.premises, r), x.wrapWidth),
      selected = nSample(x.endings, x.count, r);
    return {
      premise,
      endings: selected.map((e) => ({
        id: e.id,
        body: nWrap(e.text, x.wrapWidth),
        consequenceTags: [...e.consequenceTags],
      })),
      comparison: [...new Set(selected.flatMap((e) => e.consequenceTags))]
        .sort()
        .map((tag) => ({
          tag,
          endingIds: selected
            .filter((e) => e.consequenceTags.includes(tag))
            .map((e) => e.id),
        })),
    };
  });
export const alternateEndingComparisonExample = {
  input: {
    premises: ["A map is lost."],
    endings: [
      { id: "return", text: "She returns.", consequenceTags: ["home"] },
      { id: "leave", text: "She sails.", consequenceTags: ["journey"] },
    ],
    count: 2,
    wrapWidth: 80,
    seed: 42,
  },
  output: {
    premise: { text: "A map is lost.", lineCount: 1 },
    endings: [
      {
        id: "return",
        body: { text: "She returns.", lineCount: 1 },
        consequenceTags: ["home"],
      },
      {
        id: "leave",
        body: { text: "She sails.", lineCount: 1 },
        consequenceTags: ["journey"],
      },
    ],
    comparison: [
      { tag: "home", endingIds: ["return"] },
      { tag: "journey", endingIds: ["leave"] },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  AlternateEndingComparisonInput,
  AlternateEndingComparisonOutput
>;
export const alternateEndingComparisonTool = createModelDefinition<
  AlternateEndingComparisonInput,
  AlternateEndingComparisonOutput
>({
  id: "random/alternate-ending-comparison",
  title: "Random Alternate Ending Comparison Packet Generator",
  description:
    "Combine a supplied premise with distinct supplied endings and an explicit consequence-tag comparison without generating narrative prose.",
  inputSchema,
  outputSchema,
  execute: calculateAlternateEndingComparison,
});
export const runAlternateEndingComparison =
  alternateEndingComparisonTool.execute;
export default alternateEndingComparisonTool;
