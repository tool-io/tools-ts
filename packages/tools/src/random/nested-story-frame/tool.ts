import {
  createModelDefinition,
  matchesModelInput,
  nInput,
  nOutput,
  nArray,
  nObject,
  nId,
  nText,
  nInt,
  nWidth,
  nWrapped,
  nWrap,
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
export type NestedStoryFrameInput = NSeed & {
  readonly frames: readonly {
    readonly id: string;
    readonly storyteller: string;
    readonly text: string;
  }[];
  readonly depth: number;
  readonly wrapWidth: number;
};
export type NestedStoryFrameOutput = NReplay & {
  readonly stack: readonly string[];
  readonly markers: readonly {
    readonly kind: "enter" | "exit";
    readonly frameId: string;
    readonly storyteller: string;
    readonly depth: number;
    readonly body: NWrapped;
  }[];
};
export const inputSchema = nInput({
  frames: nArray(nObject({ id: nId, storyteller: nText, text: nText }), 16, 1),
  depth: nInt(1, 16),
  wrapWidth: nWidth,
});
export const outputSchema = nOutput({
  stack: nArray(nId, 16, 1),
  markers: nArray(
    nObject({
      kind: { type: "string", enum: ["enter", "exit"] },
      frameId: nId,
      storyteller: nText,
      depth: nInt(1, 16),
      body: nWrapped,
    }),
    32,
    2,
  ),
});
const isInput = (v: unknown): v is NestedStoryFrameInput =>
  matchesModelInput(v, inputSchema);
export const calculateNestedStoryFrame = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<NestedStoryFrameOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    nDistinct(
      x.frames.map((f) => f.id),
      "frames",
    );
    const selected = nSample(x.frames, x.depth, r);
    const entries = selected.map((f, i) => ({
      frameId: f.id,
      storyteller: f.storyteller,
      depth: i + 1,
      body: nWrap(f.text, x.wrapWidth),
    }));
    return {
      stack: selected.map((f) => f.id),
      markers: [
        ...entries.map((e) => ({ ...e, kind: "enter" as const })),
        ...entries
          .slice()
          .reverse()
          .map((e) => ({ ...e, kind: "exit" as const })),
      ],
    };
  });
export const nestedStoryFrameExample = {
  input: {
    frames: [
      { id: "harbor", storyteller: "Mara", text: "A harbor memory." },
      { id: "mountain", storyteller: "Ivo", text: "A mountain tale." },
    ],
    depth: 2,
    wrapWidth: 80,
    seed: 42,
  },
  output: {
    stack: ["mountain", "harbor"],
    markers: [
      {
        kind: "enter",
        frameId: "mountain",
        storyteller: "Ivo",
        depth: 1,
        body: { text: "A mountain tale.", lineCount: 1 },
      },
      {
        kind: "enter",
        frameId: "harbor",
        storyteller: "Mara",
        depth: 2,
        body: { text: "A harbor memory.", lineCount: 1 },
      },
      {
        kind: "exit",
        frameId: "harbor",
        storyteller: "Mara",
        depth: 2,
        body: { text: "A harbor memory.", lineCount: 1 },
      },
      {
        kind: "exit",
        frameId: "mountain",
        storyteller: "Ivo",
        depth: 1,
        body: { text: "A mountain tale.", lineCount: 1 },
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<NestedStoryFrameInput, NestedStoryFrameOutput>;
export const nestedStoryFrameTool = createModelDefinition<
  NestedStoryFrameInput,
  NestedStoryFrameOutput
>({
  id: "random/nested-story-frame",
  title: "Random Nested Story Frame Generator",
  description:
    "Build a distinct supplied storyteller stack and balanced LIFO entry/exit markers at a bounded depth; narrative quality is caller-reviewed.",
  inputSchema,
  outputSchema,
  execute: calculateNestedStoryFrame,
});
export const runNestedStoryFrame = nestedStoryFrameTool.execute;
export default nestedStoryFrameTool;
