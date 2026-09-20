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

export type Input = {
  readonly templates: readonly {
    readonly kind: "empty" | "error" | "loading";
    readonly text: string;
  }[];
  readonly contexts: readonly string[];
  readonly actions: readonly string[];
  readonly count: number;
  readonly previewLimit: number;
  readonly seed?: number;
};
export type Output = {
  readonly packets: readonly {
    readonly kind: "empty" | "error" | "loading";
    readonly context: string;
    readonly text: string;
    readonly preview: string;
    readonly action: string;
  }[];
  readonly randomness: GeneratorReplay;
};
const kind = enumeration(["empty", "error", "loading"]);
export const inputSchema = object(
  {
    templates: list(object({ kind, text })),
    contexts: list(label),
    actions: list(label),
    count: integer(1, 32),
    previewLimit: integer(0, 256),
    seed: generatorSeedSchema,
  },
  ["templates", "contexts", "actions", "count", "previewLimit"],
);
export const outputSchema = object({
  packets: list(
    object({
      kind,
      context: label,
      text: { type: "string", maxLength: 32768 },
      preview: { type: "string", maxLength: 512 },
      action: label,
    }),
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateEmptyStateCopyPacket = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    work(input.count, 256 * 128, "count", 1048576);
    const random = createGeneratorRandom(input.seed, context),
      packets = Array.from({ length: input.count }, () => {
        const template = choose(input.templates, random),
          context = choose(input.contexts, random),
          action = choose(input.actions, random),
          text = template.text.replaceAll("{context}", () => context);
        return {
          kind: template.kind,
          context,
          text,
          preview: preview(text, input.previewLimit),
          action,
        };
      });
    return toolSuccess(
      finish({ packets, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const emptyStateCopyPacketExample = {
  input: {
    templates: [
      { kind: "empty", text: "No {context}" },
      { kind: "error", text: "Retry {context}" },
    ],
    contexts: ["files", "notes"],
    actions: ["Create", "Refresh"],
    count: 1,
    previewLimit: 10,
    seed: 42,
  },
  output: {
    packets: [
      {
        kind: "error",
        context: "files",
        text: "Retry files",
        preview: "Retry fil…",
        action: "Refresh",
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const emptyStateCopyPacketTool = createModelDefinition<Input, Output>({
  id: "random/empty-state-copy-packet",
  title: "Random Empty State Copy Packet Generator",
  description:
    "Compose caller-supplied empty, error or loading copy with fictional contexts and actions, retaining full text and a codepoint preview without editorial-quality claims.",
  inputSchema,
  outputSchema,
  execute: calculateEmptyStateCopyPacket,
});
export const runEmptyStateCopyPacket = emptyStateCopyPacketTool.execute;
export default emptyStateCopyPacketTool;
