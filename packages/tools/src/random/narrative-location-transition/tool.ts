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
  nRefs,
  nSum,
  nTick,
  nRun,
  simpleError,
  type NSeed,
  type NReplay,
  type NWrapped,
  type ToolExecutionContext,
  type ToolResult,
  type ToolExample,
} from "../m500b-narrative-support.js";
export type NarrativeLocationTransitionInput = NSeed & {
  readonly settings: readonly {
    readonly id: string;
    readonly text: string;
    readonly opens: number;
    readonly closes: number;
  }[];
  readonly transitions: readonly {
    readonly id: string;
    readonly from: string;
    readonly to: string;
    readonly seconds: number;
    readonly motivation: string;
  }[];
  readonly startSettingId: string;
  readonly startSecond: number;
  readonly sceneCount: number;
  readonly sceneSeconds: number;
  readonly wrapWidth: number;
};
export type NarrativeLocationTransitionOutput = NReplay & {
  readonly itinerary: readonly {
    readonly settingId: string;
    readonly arrivalSecond: number;
    readonly startSecond: number;
    readonly endSecond: number;
    readonly transitionId: string | null;
    readonly motivation: NWrapped;
    readonly setting: NWrapped;
  }[];
};
export const inputSchema = nInput({
  settings: nArray(
    nObject({ id: nId, text: nText, opens: nInt(), closes: nInt() }),
    16,
    1,
  ),
  transitions: nArray(
    nObject({
      id: nId,
      from: nId,
      to: nId,
      seconds: nInt(),
      motivation: nText,
    }),
    32,
  ),
  startSettingId: nId,
  startSecond: nInt(),
  sceneCount: nInt(1, 16),
  sceneSeconds: nInt(1),
  wrapWidth: nWidth,
});
export const outputSchema = nOutput({
  itinerary: nArray(
    nObject({
      settingId: nId,
      arrivalSecond: nInt(),
      startSecond: nInt(),
      endSecond: nInt(),
      transitionId: { anyOf: [nId, { type: "null" }] },
      motivation: nWrapped,
      setting: nWrapped,
    }),
    16,
    1,
  ),
});
const isInput = (v: unknown): v is NarrativeLocationTransitionInput =>
  matchesModelInput(v, inputSchema);
export const calculateNarrativeLocationTransition = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<NarrativeLocationTransitionOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    const ids = x.settings.map((s) => s.id);
    nDistinct(ids, "settings");
    nDistinct(
      x.transitions.map((t) => t.id),
      "transitions",
    );
    nRefs([x.startSettingId], ids, "startSettingId");
    for (const s of x.settings)
      if (s.closes < s.opens)
        return simpleError(
          "settings",
          "Setting windows must be ordered.",
          "invalid_time_window",
        );
    for (const t of x.transitions) {
      nRefs([t.from], ids, "transitions.from");
      nRefs([t.to], ids, "transitions.to");
      if (t.from === t.to)
        return simpleError(
          "transitions",
          "Location transitions must change settings.",
          "self_transition",
        );
    }
    const itinerary: NarrativeLocationTransitionOutput["itinerary"][number][] =
        [],
      tick = nTick();
    const search = (
      settingId: string,
      arrivalSecond: number,
      transitionId: string | null,
      motivation: string,
    ): boolean => {
      tick();
      arrivalSecond = arrivalSecond || 0;
      const setting = x.settings.find((s) => s.id === settingId);
      if (!setting) throw new Error("missing setting");
      const startSecond = Math.max(arrivalSecond, setting.opens) || 0,
        endSecond = nSum([startSecond, x.sceneSeconds], "sceneSeconds");
      if (endSecond > setting.closes) return false;
      itinerary.push({
        settingId,
        arrivalSecond,
        startSecond,
        endSecond,
        transitionId,
        motivation: nWrap(motivation, x.wrapWidth),
        setting: nWrap(setting.text, x.wrapWidth),
      });
      if (itinerary.length === x.sceneCount) return true;
      const edges = x.transitions.filter((t) => t.from === settingId);
      for (const t of nSample(edges, edges.length, r))
        if (
          search(
            t.to,
            nSum([endSecond, t.seconds], "transitions.seconds"),
            t.id,
            t.motivation,
          )
        )
          return true;
      itinerary.pop();
      return false;
    };
    if (!search(x.startSettingId, x.startSecond, null, ""))
      return simpleError(
        "transitions",
        "No itinerary fits the supplied windows and links.",
        "infeasible_itinerary",
      );
    return { itinerary };
  });
export const narrativeLocationTransitionExample = {
  input: {
    settings: [
      { id: "dock", text: "At the dock.", opens: 0, closes: 20 },
      { id: "loft", text: "In the loft.", opens: 0, closes: 30 },
    ],
    transitions: [
      {
        id: "stairs",
        from: "dock",
        to: "loft",
        seconds: 3,
        motivation: "Follow the map.",
      },
    ],
    startSettingId: "dock",
    startSecond: 0,
    sceneCount: 2,
    sceneSeconds: 4,
    wrapWidth: 80,
    seed: 42,
  },
  output: {
    itinerary: [
      {
        settingId: "dock",
        arrivalSecond: 0,
        startSecond: 0,
        endSecond: 4,
        transitionId: null,
        motivation: { text: "", lineCount: 0 },
        setting: { text: "At the dock.", lineCount: 1 },
      },
      {
        settingId: "loft",
        arrivalSecond: 7,
        startSecond: 7,
        endSecond: 11,
        transitionId: "stairs",
        motivation: { text: "Follow the map.", lineCount: 1 },
        setting: { text: "In the loft.", lineCount: 1 },
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  NarrativeLocationTransitionInput,
  NarrativeLocationTransitionOutput
>;
export const narrativeLocationTransitionTool = createModelDefinition<
  NarrativeLocationTransitionInput,
  NarrativeLocationTransitionOutput
>({
  id: "random/narrative-location-transition",
  title: "Random Narrative Location Transition Plan Generator",
  description:
    "Construct fictional scene itineraries through supplied directed motivations and travel seconds, waiting for explicit setting windows when needed, with bounded feasibility search.",
  inputSchema,
  outputSchema,
  execute: calculateNarrativeLocationTransition,
});
export const runNarrativeLocationTransition =
  narrativeLocationTransitionTool.execute;
export default narrativeLocationTransitionTool;
