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
  nWidth,
  nWrapped,
  nWrap,
  nPick,
  nDistinct,
  nIntersect,
  nRun,
  simpleError,
  type NSeed,
  type NReplay,
  type NWrapped,
  type ToolExecutionContext,
  type ToolResult,
  type ToolExample,
} from "../m500b-narrative-support.js";
export type FlashbackTriggerMapInput = NSeed & {
  readonly presentScenes: readonly {
    readonly id: string;
    readonly text: string;
    readonly time: number;
    readonly triggerTags: readonly string[];
  }[];
  readonly pastEvents: readonly {
    readonly id: string;
    readonly text: string;
    readonly time: number;
    readonly tags: readonly string[];
  }[];
  readonly wrapWidth: number;
};
export type FlashbackTriggerMapOutput = NReplay & {
  readonly links: readonly {
    readonly sceneId: string;
    readonly eventId: string;
    readonly scene: NWrapped;
    readonly flashback: NWrapped;
    readonly triggerTags: readonly string[];
    readonly compatibleEventIds: readonly string[];
  }[];
  readonly timeline: readonly {
    readonly id: string;
    readonly kind: "past" | "present";
    readonly time: number;
  }[];
};
export const inputSchema = nInput({
  presentScenes: nArray(
    nObject({
      id: nId,
      text: nText,
      time: { type: "integer" },
      triggerTags: nTags,
    }),
    16,
    1,
  ),
  pastEvents: nArray(
    nObject({ id: nId, text: nText, time: { type: "integer" }, tags: nTags }),
    32,
    1,
  ),
  wrapWidth: nWidth,
});
export const outputSchema = nOutput({
  links: nArray(
    nObject({
      sceneId: nId,
      eventId: nId,
      scene: nWrapped,
      flashback: nWrapped,
      triggerTags: nTags,
      compatibleEventIds: nArray(nId, 32, 1),
    }),
    16,
    1,
  ),
  timeline: nArray(
    nObject({
      id: nId,
      kind: { type: "string", enum: ["past", "present"] },
      time: { type: "integer" },
    }),
    48,
    2,
  ),
});
const isInput = (v: unknown): v is FlashbackTriggerMapInput =>
  matchesModelInput(v, inputSchema);
export const calculateFlashbackTriggerMap = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<FlashbackTriggerMapOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    nDistinct(
      [...x.presentScenes.map((s) => s.id), ...x.pastEvents.map((e) => e.id)],
      "timeline",
    );
    for (const s of x.presentScenes)
      nDistinct(s.triggerTags, "presentScenes.triggerTags");
    for (const e of x.pastEvents) nDistinct(e.tags, "pastEvents.tags");
    const links = x.presentScenes.map((s) => {
      const eligible = x.pastEvents.filter(
        (e) => e.time < s.time && nIntersect(s.triggerTags, e.tags).length,
      );
      if (!eligible.length)
        return simpleError(
          "presentScenes",
          "Every present scene requires a strictly earlier tagged event.",
          "infeasible_flashback",
        );
      const event = nPick(eligible, r);
      return {
        sceneId: s.id,
        eventId: event.id,
        scene: nWrap(s.text, x.wrapWidth),
        flashback: nWrap(event.text, x.wrapWidth),
        triggerTags: nIntersect(s.triggerTags, event.tags),
        compatibleEventIds: eligible.map((e) => e.id),
      };
    });
    return {
      links,
      timeline: [
        ...x.pastEvents.map((e) => ({
          id: e.id,
          kind: "past" as const,
          time: e.time || 0,
        })),
        ...x.presentScenes.map((s) => ({
          id: s.id,
          kind: "present" as const,
          time: s.time || 0,
        })),
      ].sort((a, b) =>
        a.time < b.time ? -1 : a.time > b.time ? 1 : a.id < b.id ? -1 : 1,
      ),
    };
  });
export const flashbackTriggerMapExample = {
  input: {
    presentScenes: [
      { id: "bell", text: "The bell rings.", time: 10, triggerTags: ["sound"] },
      { id: "map", text: "A map unfolds.", time: 12, triggerTags: ["paper"] },
    ],
    pastEvents: [
      { id: "arrival", text: "A ship arrived.", time: 2, tags: ["sound"] },
      { id: "letter", text: "A letter arrived.", time: 4, tags: ["paper"] },
    ],
    wrapWidth: 80,
    seed: 42,
  },
  output: {
    links: [
      {
        sceneId: "bell",
        eventId: "arrival",
        scene: { text: "The bell rings.", lineCount: 1 },
        flashback: { text: "A ship arrived.", lineCount: 1 },
        triggerTags: ["sound"],
        compatibleEventIds: ["arrival"],
      },
      {
        sceneId: "map",
        eventId: "letter",
        scene: { text: "A map unfolds.", lineCount: 1 },
        flashback: { text: "A letter arrived.", lineCount: 1 },
        triggerTags: ["paper"],
        compatibleEventIds: ["letter"],
      },
    ],
    timeline: [
      { id: "arrival", kind: "past", time: 2 },
      { id: "letter", kind: "past", time: 4 },
      { id: "bell", kind: "present", time: 10 },
      { id: "map", kind: "present", time: 12 },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<FlashbackTriggerMapInput, FlashbackTriggerMapOutput>;
export const flashbackTriggerMapTool = createModelDefinition<
  FlashbackTriggerMapInput,
  FlashbackTriggerMapOutput
>({
  id: "random/flashback-trigger-map",
  title: "Random Flashback Trigger Map Generator",
  description:
    "Connect supplied present scenes to strictly earlier fictional events through explicit trigger tags, retaining compatible alternatives and the complete reference timeline.",
  inputSchema,
  outputSchema,
  execute: calculateFlashbackTriggerMap,
});
export const runFlashbackTriggerMap = flashbackTriggerMapTool.execute;
export default flashbackTriggerMapTool;
