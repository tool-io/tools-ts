import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  text,
  label,
  id,
  bool,
  number,
  integer,
  list,
  object,
  enumeration,
  nullable,
  markup,
  parsedSchema,
  choose,
  preview,
  distinct,
  work,
  finite,
  escape,
  parse,
  finish,
} from "../m500b-ui-accessibility-support.js";
import { runChunk } from "../../list/chunk/tool.js";

export type Input = {
  readonly messages: readonly string[];
  readonly count: number;
  readonly groupSize: number;
  readonly policy: "off" | "polite" | "assertive";
  readonly atomic: boolean;
  readonly seed?: number;
};
export type Output = {
  readonly updates: readonly { readonly tick: number; readonly text: string }[];
  readonly groups: readonly (readonly string[])[];
  readonly modeledAnnouncements: readonly string[];
  readonly regionTag: string;
  readonly parsed: import("../../html/attribute-parser/tool.js").ParsedHtmlTag;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    messages: list(label),
    count: integer(1, 32),
    groupSize: integer(1, 32),
    policy: enumeration(["off", "polite", "assertive"]),
    atomic: bool,
    seed: generatorSeedSchema,
  },
  ["messages", "count", "groupSize", "policy", "atomic"],
);
export const outputSchema = object({
  updates: list(object({ tick: integer(1, 32), text: label })),
  groups: list(list(label), 32),
  modeledAnnouncements: list(label, 32, 0),
  regionTag: markup,
  parsed: parsedSchema,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateLiveRegionMessageSequence = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context),
      values = Array.from({ length: input.count }, () =>
        choose(input.messages, random),
      ),
      chunked = runChunk({ values, size: input.groupSize });
    if (!chunked.ok)
      throw new Error("Constructed bounded messages rejected by chunk core");
    const raw: unknown = chunked.output.chunks.values;
    if (!Array.isArray(raw))
      throw new Error("Chunk core returned invalid groups");
    const groups: string[][] = [];
    for (const group of raw) {
      if (
        !Array.isArray(group) ||
        !group.every((v: unknown) => typeof v === "string")
      )
        throw new Error("Chunk core returned invalid group");
      groups.push(group.map((v: string) => v));
    }
    const modeledAnnouncements =
        input.policy === "off"
          ? []
          : input.atomic
            ? groups.map((g) => {
                const last = g.at(-1);
                if (last === undefined) throw new Error("Empty chunk");
                return last;
              })
            : groups.flat(),
      updates = values.map((text, i) => ({ tick: i + 1, text })),
      regionTag =
        '<div aria-live="' +
        input.policy +
        '" aria-atomic="' +
        input.atomic +
        '">',
      parsed = parse(regionTag);
    return toolSuccess(
      finish({
        updates,
        groups,
        modeledAnnouncements,
        regionTag,
        parsed,
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const liveRegionMessageSequenceExample = {
  input: {
    messages: ["Saved", "Queued"],
    count: 3,
    groupSize: 2,
    policy: "polite",
    atomic: true,
    seed: 42,
  },
  output: {
    updates: [
      { tick: 1, text: "Queued" },
      { tick: 2, text: "Saved" },
      { tick: 3, text: "Queued" },
    ],
    groups: [["Queued", "Saved"], ["Queued"]],
    modeledAnnouncements: ["Saved", "Queued"],
    regionTag: '<div aria-live="polite" aria-atomic="true">',
    parsed: {
      name: "div",
      attributes: [
        { name: "aria-live", value: "polite" },
        { name: "aria-atomic", value: "true" },
      ],
    },
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const liveRegionMessageSequenceTool = createModelDefinition<
  Input,
  Output
>({
  id: "random/live-region-message-sequence",
  title: "Random Live Region Message Sequence Generator",
  description:
    "Generate grouped synthetic status updates under supplied live/atomic policies, retaining lexical attributes and a declared coalescing convention rather than predicting assistive-technology announcements.",
  inputSchema,
  outputSchema,
  execute: calculateLiveRegionMessageSequence,
});
export const runLiveRegionMessageSequence =
  liveRegionMessageSequenceTool.execute;
export default liveRegionMessageSequenceTool;
