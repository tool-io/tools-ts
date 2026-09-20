import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import { simpleError } from "../../core/simple.js";
import { calculateWordWrap } from "../../text/word-wrap/tool.js";
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
export type ComicPanelTemplate = {
  readonly id: string;
  readonly from: string;
  readonly to: string;
  readonly scene: string;
  readonly action: string;
  readonly dialogue: string;
};
export type ComicPanelStoryboardInput = FcSeed & {
  readonly count: number;
  readonly startState: string;
  readonly endState: string;
  readonly templates: readonly ComicPanelTemplate[];
  readonly textLimit: number;
  readonly dialogueWrapWidth: number;
};
export type ComicPanelStoryboardOutput = FcReplay & {
  readonly fictional: boolean;
  readonly panels: readonly (ComicPanelTemplate & {
    readonly panel: number;
    readonly textLength: number;
    readonly wrappedDialogue: string;
  })[];
};
const fields = {
  id: fcId,
  from: fcId,
  to: fcId,
  scene: fcText,
  action: fcText,
  dialogue: fcText,
};
export const inputSchema = fcInput({
  count: fcInteger(1, 32),
  startState: fcId,
  endState: fcId,
  templates: fcArray(fcObject(fields), 32, 1),
  textLimit: fcInteger(0, 6144),
  dialogueWrapWidth: fcInteger(1, 2048),
});
export const outputSchema = fcOutput({
  fictional: { type: "boolean", const: true },
  panels: fcArray(
    fcObject({
      ...fields,
      panel: fcInteger(1, 32),
      textLength: fcInteger(0, 6144),
      wrappedDialogue: fcText,
    }),
    32,
    1,
  ),
});
const isInput = (v: unknown): v is ComicPanelStoryboardInput =>
  matchesModelInput(v, inputSchema);
export const calculateComicPanelStoryboard = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  fcRun(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<ComicPanelStoryboardOutput, "randomness"> => {
      fcUnique(
        x.templates.map((t) => t.id),
        "templates",
      );
      const panels: ComicPanelStoryboardOutput["panels"][number][] = [],
        tick = fcBudget(20_000);
      const search = (state: string): boolean => {
        tick();
        if (panels.length === x.count) return state === x.endState;
        const candidates = x.templates.filter(
          (t) =>
            t.from === state &&
            t.scene.length + t.action.length + t.dialogue.length <= x.textLimit,
        );
        for (const t of fcChoices(candidates, random)) {
          panels.push({
            ...t,
            panel: panels.length + 1,
            textLength: t.scene.length + t.action.length + t.dialogue.length,
            wrappedDialogue: calculateWordWrap({
              text: t.dialogue,
              width: x.dialogueWrapWidth,
            }).wrappedText,
          });
          if (search(t.to)) return true;
          panels.pop();
        }
        return false;
      };
      if (!search(x.startState))
        simpleError(
          "templates",
          "No storyboard meets the state, panel-count, and text-budget requirements.",
          "infeasible_storyboard",
        );
      return { fictional: true, panels };
    },
  );
export const comicPanelStoryboardExample = {
  input: {
    count: 2,
    startState: "quay",
    endState: "home",
    templates: [
      {
        id: "find",
        from: "quay",
        to: "tower",
        scene: "Harbor",
        action: "Find the bell",
        dialogue: "Here!",
      },
      {
        id: "return",
        from: "tower",
        to: "home",
        scene: "Tower",
        action: "Carry it home",
        dialogue: "At last",
      },
    ],
    textLimit: 25,
    dialogueWrapWidth: 8,
    seed: 42,
  },
  output: {
    fictional: true,
    panels: [
      {
        id: "find",
        from: "quay",
        to: "tower",
        scene: "Harbor",
        action: "Find the bell",
        dialogue: "Here!",
        panel: 1,
        textLength: 24,
        wrappedDialogue: "Here!",
      },
      {
        id: "return",
        from: "tower",
        to: "home",
        scene: "Tower",
        action: "Carry it home",
        dialogue: "At last",
        panel: 2,
        textLength: 25,
        wrappedDialogue: "At last",
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  ComicPanelStoryboardInput,
  ComicPanelStoryboardOutput
>;
export const comicPanelStoryboardTool = createModelDefinition<
  ComicPanelStoryboardInput,
  ComicPanelStoryboardOutput
>({
  id: "random/comic-panel-storyboard",
  title: "Random Comic Panel Storyboard Generator",
  description:
    "Compose supplied fictional scene, action, and dialogue transitions into an exact panel count with continuity and combined UTF-16 text budgets.",
  inputSchema,
  outputSchema,
  execute: calculateComicPanelStoryboard,
});
export const runComicPanelStoryboard = comicPanelStoryboardTool.execute;
export default comicPanelStoryboardTool;
