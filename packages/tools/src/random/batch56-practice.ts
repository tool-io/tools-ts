import type {
  ToolDefinition,
  ToolExecutionContext,
  ToolPortDefinition,
} from "../core/definition.js";
import { invalidInput, type ToolError } from "../core/result.js";
import type { SimpleField } from "../core/simple.js";
import * as H from "../histogram/batch56-shared.js";
export { validate } from "../histogram/batch56-shared.js";
export type PracticeInput = Readonly<{
  seed: string;
  count: number;
  withoutReplacement: boolean;
  candidatesJson: string;
}>;
export const fields = [
  { id: "seed", label: "Replay seed", kind: "string" },
  { id: "count", label: "Number of examples", kind: "integer" },
  {
    id: "withoutReplacement",
    label: "Do not repeat eligible candidate IDs",
    kind: "boolean",
  },
  {
    id: "candidatesJson",
    label: "Explicit bounded candidate ID and input bank",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
export type PracticeOutput = {
  readonly result: {
    readonly status:
      "ok" | "empty-eligible-bank" | "insufficient-eligible-bank";
    readonly baseToolId: string;
    readonly model: {
      readonly description: string;
      readonly inputs: readonly ToolPortDefinition[];
      readonly outputs: readonly ToolPortDefinition[];
    };
    readonly replay: {
      readonly seed: string;
      readonly source: "seeded" | "injected";
      readonly count: number;
      readonly withoutReplacement: boolean;
      readonly draws: number;
    };
    readonly eligibleCandidateIds: readonly string[];
    readonly rejected: readonly {
      id: string;
      index: number;
      error: ToolError;
    }[];
    readonly exercises: readonly {
      candidateId: string;
      sourceIndex: number;
      prompt: Readonly<Record<string, unknown>>;
      answer: unknown;
    }[];
  };
};
export const importedTool = (
  module: Readonly<Record<string, unknown>>,
  id: string,
): ToolDefinition<unknown, unknown> => {
  const tool = Object.values(module).find(
    (v) =>
      v !== null &&
      typeof v === "object" &&
      (v as { id?: unknown }).id === id &&
      typeof (v as { execute?: unknown }).execute === "function",
  );
  H.check(tool, "Expected existing imported executable definition");
  return tool as ToolDefinition<unknown, unknown>;
};
export const canonicalInput = (
  module: Readonly<Record<string, unknown>>,
): Readonly<Record<string, unknown>> => {
  for (const v of Object.values(module))
    if (v !== null && typeof v === "object" && Object.hasOwn(v, "input")) {
      const r = v as { input: unknown };
      if (
        r.input !== null &&
        typeof r.input === "object" &&
        !Array.isArray(r.input)
      )
        return JSON.parse(JSON.stringify(r.input)) as Record<string, unknown>;
    }
  H.check(false, "Imported source must expose a canonical input example");
  return {};
};
export const practice = (
  base: ToolDefinition<unknown, unknown>,
  input: PracticeInput,
  context?: ToolExecutionContext,
): PracticeOutput => {
  H.int(input.count, 1, 32);
  H.check(!context?.signal?.aborted, "Cancelled");
  const candidates = H.records(input.candidatesJson).map((v, index) => {
    H.check(
      Object.keys(v).length === 2 &&
        Object.hasOwn(v, "id") &&
        Object.hasOwn(v, "input"),
    );
    const id = H.str(v.id);
    H.check(id.length > 0);
    const data = H.rec(v.input);
    return { id, index, input: data };
  });
  H.uniqueIds(candidates.map((v) => v.id));
  const rejected: { id: string; index: number; error: ToolError }[] = [],
    eligible: {
      id: string;
      index: number;
      input: Record<string, unknown>;
      answer: unknown;
    }[] = [];
  for (const c of candidates) {
    H.check(!context?.signal?.aborted, "Cancelled");
    const result = base.execute(c.input, {
      ...context,
      random: () => {
        throw new Error(
          "Imported educational calculator must not draw randomness",
        );
      },
    });
    if (result.ok) {
      try {
        H.finish({ prompt: c.input, answer: result.output });
        eligible.push({ ...c, answer: result.output });
      } catch {
        const issue = invalidInput([
          {
            field: "candidatesJson",
            code: "practice_evidence_budget_exceeded",
            message:
              "Imported prompt/answer exceeds the portable practice evidence budget; the source calculation is not reclassified as mathematically invalid.",
          },
        ]);
        if (!issue.ok)
          rejected.push({ id: c.id, index: c.index, error: issue.error });
      }
    } else rejected.push({ id: c.id, index: c.index, error: result.error });
  }
  const status =
    eligible.length === 0
      ? "empty-eligible-bank"
      : input.withoutReplacement && input.count > eligible.length
        ? "insufficient-eligible-bank"
        : "ok";
  let draws = 0;
  const source = H.randomSource(input.seed, context),
    random = () => {
      H.check(!context?.signal?.aborted, "Cancelled");
      draws++;
      return source();
    };
  const selected =
    status !== "ok"
      ? []
      : input.withoutReplacement
        ? H.choosePositions(eligible.length, input.count, random)
        : Array.from({ length: input.count }, () =>
            H.randint(0, eligible.length - 1, random),
          );
  const result: PracticeOutput = {
    result: {
      status,
      baseToolId: base.id,
      model: {
        description: base.description,
        inputs: base.ports.inputs,
        outputs: base.ports.outputs,
      },
      replay: {
        seed: input.seed,
        source: context?.random ? "injected" : "seeded",
        count: input.count,
        withoutReplacement: input.withoutReplacement,
        draws,
      },
      eligibleCandidateIds: eligible.map((v) => v.id),
      rejected,
      exercises: selected.map((j) => ({
        candidateId: eligible[j].id,
        sourceIndex: eligible[j].index,
        prompt: eligible[j].input,
        answer: eligible[j].answer,
      })),
    },
  };
  H.finish(result.result);
  return result;
};
