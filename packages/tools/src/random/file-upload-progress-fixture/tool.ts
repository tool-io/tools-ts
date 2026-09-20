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

type Upload = {
  readonly id: string;
  readonly name: string;
  readonly status: "queued" | "uploading" | "failed" | "canceled" | "complete";
  readonly progress: number;
};
export type Input = {
  readonly fileNames: readonly string[];
  readonly eventCount: number;
  readonly maximumIncrement: number;
  readonly seed?: number;
};
export type Output = {
  readonly initial: readonly Upload[];
  readonly events: readonly {
    readonly fileId: string;
    readonly action: string;
    readonly before: number;
    readonly after: number;
    readonly files: readonly Upload[];
  }[];
  readonly final: readonly Upload[];
  readonly randomness: GeneratorReplay;
};
const filesSchema = list(
  object({
    id,
    name: label,
    status: enumeration([
      "queued",
      "uploading",
      "failed",
      "canceled",
      "complete",
    ]),
    progress: integer(0, 100),
  }),
  16,
);
export const inputSchema = object(
  {
    fileNames: list(label, 16),
    eventCount: integer(1, 32),
    maximumIncrement: integer(1, 100),
    seed: generatorSeedSchema,
  },
  ["fileNames", "eventCount", "maximumIncrement"],
);
export const outputSchema = object({
  initial: filesSchema,
  events: list(
    object({
      fileId: id,
      action: enumeration([
        "start",
        "advance",
        "fail",
        "retry",
        "cancel",
        "terminal",
      ]),
      before: integer(0, 100),
      after: integer(0, 100),
      files: filesSchema,
    }),
  ),
  final: filesSchema,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateFileUploadProgressFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    work(input.eventCount, input.fileNames.length, "eventCount");
    const random = createGeneratorRandom(input.seed, context),
      files: {
        id: string;
        name: string;
        status: Upload["status"];
        progress: number;
      }[] = input.fileNames.map((name, i) => ({
        id: "upload-" + i,
        name: preview(name, 128),
        status: "queued",
        progress: 0,
      })),
      snapshot = () => files.map((f) => ({ ...f })),
      initial = snapshot();
    const events = Array.from({ length: input.eventCount }, () => {
      const file = choose(files, random),
        before = file.progress;
      let action: string;
      if (file.status === "queued") {
        action = "start";
        file.status = "uploading";
      } else if (file.status === "failed") {
        action = choose(["retry", "cancel"], random);
        file.status = action === "retry" ? "uploading" : "canceled";
      } else if (file.status === "uploading") {
        action = choose(["fail", "cancel", "advance"], random);
        if (action === "advance") {
          file.progress = Math.min(
            100,
            file.progress + random.integer(1, input.maximumIncrement),
          );
          if (file.progress === 100) file.status = "complete";
        } else file.status = action === "fail" ? "failed" : "canceled";
      } else action = "terminal";
      return {
        fileId: file.id,
        action,
        before,
        after: file.progress,
        files: snapshot(),
      };
    });
    return toolSuccess(
      finish({
        initial,
        events,
        final: snapshot(),
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const fileUploadProgressFixtureExample = {
  input: {
    fileNames: ["report.pdf"],
    eventCount: 3,
    maximumIncrement: 50,
    seed: 42,
  },
  output: {
    initial: [
      { id: "upload-0", name: "report.pdf", status: "queued", progress: 0 },
    ],
    events: [
      {
        fileId: "upload-0",
        action: "start",
        before: 0,
        after: 0,
        files: [
          {
            id: "upload-0",
            name: "report.pdf",
            status: "uploading",
            progress: 0,
          },
        ],
      },
      {
        fileId: "upload-0",
        action: "advance",
        before: 0,
        after: 34,
        files: [
          {
            id: "upload-0",
            name: "report.pdf",
            status: "uploading",
            progress: 34,
          },
        ],
      },
      {
        fileId: "upload-0",
        action: "cancel",
        before: 34,
        after: 34,
        files: [
          {
            id: "upload-0",
            name: "report.pdf",
            status: "canceled",
            progress: 34,
          },
        ],
      },
    ],
    final: [
      { id: "upload-0", name: "report.pdf", status: "canceled", progress: 34 },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const fileUploadProgressFixtureTool = createModelDefinition<
  Input,
  Output
>({
  id: "random/file-upload-progress-fixture",
  title: "Random File Upload Progress Fixture Generator",
  description:
    "Construct synthetic queued/uploading/failed/retry/cancel/complete traces with per-file monotonic integer percentages and immutable snapshots, without file or network access.",
  inputSchema,
  outputSchema,
  execute: calculateFileUploadProgressFixture,
});
export const runFileUploadProgressFixture =
  fileUploadProgressFixtureTool.execute;
export default fileUploadProgressFixtureTool;
