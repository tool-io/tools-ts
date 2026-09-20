import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createModelDefinition } from "../../core/model-definition.js";
import { simpleError } from "../../core/simple.js";
import {
  fcArray,
  fcBudget,
  fcChoices,
  fcId,
  fcInput,
  fcInteger,
  fcObject,
  fcOutput,
  fcRun,
  fcText,
  fcUnique,
  matchesModelInput,
  type FcReplay,
  type FcSeed,
} from "../m250-fiction-craft-common.js";
export type StoryBeatTemplate = {
  readonly id: string;
  readonly phase: "opening" | "conflict" | "resolution";
  readonly text: string;
  readonly requires: readonly string[];
  readonly adds: readonly string[];
  readonly removes: readonly string[];
};
export type StoryBeatOutlineInput = FcSeed & {
  readonly count: number;
  readonly genre: string;
  readonly initialTags: readonly string[];
  readonly templates: readonly StoryBeatTemplate[];
};
export type StoryBeatOutlineOutput = FcReplay & {
  readonly fictional: boolean;
  readonly beats: readonly {
    readonly id: number;
    readonly previousId: number | null;
    readonly templateId: string;
    readonly phase: string;
    readonly text: string;
    readonly tagsBefore: readonly string[];
    readonly tagsAfter: readonly string[];
  }[];
};
const tags = fcArray(fcId, 32),
  phase = {
    type: "string",
    enum: ["opening", "conflict", "resolution"],
  } as const;
const template = fcObject({
  id: fcId,
  phase,
  text: fcText,
  requires: tags,
  adds: tags,
  removes: tags,
});
export const inputSchema = fcInput({
  count: fcInteger(3, 32),
  genre: fcText,
  initialTags: tags,
  templates: fcArray(template, 32, 1),
});
export const outputSchema = fcOutput({
  fictional: { type: "boolean", const: true },
  beats: fcArray(
    fcObject({
      id: fcInteger(1, 32),
      previousId: { anyOf: [fcInteger(1, 31), { type: "null" }] },
      templateId: fcId,
      phase,
      text: { type: "string", maxLength: 65536 },
      tagsBefore: fcArray(fcId, 1056),
      tagsAfter: fcArray(fcId, 1056),
    }),
    32,
    3,
  ),
});
const isInput = (v: unknown): v is StoryBeatOutlineInput =>
  matchesModelInput(v, inputSchema);
export const calculateStoryBeatOutline = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  fcRun(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<StoryBeatOutlineOutput, "randomness"> => {
      fcUnique(
        x.templates.map((t) => t.id),
        "templates",
      );
      fcUnique(x.initialTags, "initialTags");
      for (const t of x.templates) {
        for (const key of ["requires", "adds", "removes"] as const)
          fcUnique(t[key], "templates." + t.id + "." + key);
        if (t.adds.some((tag) => t.removes.includes(tag)))
          simpleError(
            "templates",
            "A beat cannot both add and remove the same tag.",
            "contradictory_transition",
          );
      }
      const beats: StoryBeatOutlineOutput["beats"][number][] = [],
        tick = fcBudget(20_000);
      const search = (state: readonly string[]): boolean => {
        tick();
        const index = beats.length;
        if (index === x.count) return true;
        const requiredPhase =
          index === 0
            ? "opening"
            : index === x.count - 1
              ? "resolution"
              : "conflict";
        const candidates = x.templates.filter(
          (t) =>
            t.phase === requiredPhase &&
            t.requires.every((tag) => state.includes(tag)) &&
            t.removes.every((tag) => state.includes(tag)),
        );
        for (const t of fcChoices(candidates, random)) {
          const after = [
            ...new Set([
              ...state.filter((tag) => !t.removes.includes(tag)),
              ...t.adds,
            ]),
          ].sort();
          const text = t.text.replaceAll("{genre}", x.genre);
          if (text.length > 65536)
            simpleError(
              "templates",
              "An expanded beat exceeds the 65,536-character text budget.",
              "resource_limit_exceeded",
            );
          beats.push({
            id: index + 1,
            previousId: index || null,
            templateId: t.id,
            phase: t.phase,
            text,
            tagsBefore: [...state],
            tagsAfter: after,
          });
          if (search(after)) return true;
          beats.pop();
        }
        return false;
      };
      if (!search([...x.initialTags].sort()))
        simpleError(
          "templates",
          "No outline satisfies the phase and continuity requirements.",
          "infeasible_continuity",
        );
      return { fictional: true, beats };
    },
  );
export const storyBeatOutlineExample = {
  input: {
    count: 3,
    genre: "mystery",
    initialTags: [],
    templates: [
      {
        id: "arrival",
        phase: "opening",
        text: "A {genre} begins at the harbor.",
        requires: [],
        adds: ["missing"],
        removes: [],
      },
      {
        id: "search",
        phase: "conflict",
        text: "The lantern is found.",
        requires: ["missing"],
        adds: ["found"],
        removes: ["missing"],
      },
      {
        id: "return",
        phase: "resolution",
        text: "The lantern returns home.",
        requires: ["found"],
        adds: [],
        removes: [],
      },
    ],
    seed: 42,
  },
  output: {
    fictional: true,
    beats: [
      {
        id: 1,
        previousId: null,
        templateId: "arrival",
        phase: "opening",
        text: "A mystery begins at the harbor.",
        tagsBefore: [],
        tagsAfter: ["missing"],
      },
      {
        id: 2,
        previousId: 1,
        templateId: "search",
        phase: "conflict",
        text: "The lantern is found.",
        tagsBefore: ["missing"],
        tagsAfter: ["found"],
      },
      {
        id: 3,
        previousId: 2,
        templateId: "return",
        phase: "resolution",
        text: "The lantern returns home.",
        tagsBefore: ["found"],
        tagsAfter: ["found"],
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<StoryBeatOutlineInput, StoryBeatOutlineOutput>;
export const storyBeatOutlineTool = createModelDefinition<
  StoryBeatOutlineInput,
  StoryBeatOutlineOutput
>({
  id: "random/story-beat-outline",
  title: "Random Story Beat Outline Generator",
  description:
    "Compose supplied fictional opening, conflict, and resolution templates with checked tag continuity using bounded randomized backtracking.",
  inputSchema,
  outputSchema,
  execute: calculateStoryBeatOutline,
});
export const runStoryBeatOutline = storyBeatOutlineTool.execute;
export default storyBeatOutlineTool;
