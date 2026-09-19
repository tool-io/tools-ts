import type {
  ToolDefinition,
  ToolExecutionContext,
} from "../core/definition.js";
import { invalidInput, type ToolError } from "../core/result.js";
import { matchesToolJsonSchema } from "../core/contract.js";
import * as H from "../histogram/batch56-shared.js";
import * as original from "./batch56-practice.js";
export {
  fields,
  validate,
  importedTool,
  canonicalInput,
  type PracticeInput,
} from "./batch56-practice.js";
const integerSearchLimits: Readonly<
  Record<string, Readonly<Record<string, number>>>
> = {
  "number/aliquot-sum": { n: 1000000 },
  "number/coprime-count": { value: 1000000 },
  "number/divisor-count": { value: 1000000 },
  "number/divisor-sum": { value: 1000000 },
  "number/mobius": { n: 1000000 },
  "number/next-prime": { n: 1000000 },
};
export type PracticeOutput = original.PracticeOutput & {
  readonly result: original.PracticeOutput["result"] & {
    readonly practiceLimits: Readonly<Record<string, number>>;
  };
};
export const practice = (
  base: ToolDefinition<unknown, unknown>,
  input: original.PracticeInput,
  context?: ToolExecutionContext,
): PracticeOutput => {
  const limits = integerSearchLimits[base.id] ?? {};
  const bounded: ToolDefinition<unknown, unknown> = {
    ...base,
    execute: (raw, context) => {
      if (raw !== null && typeof raw === "object" && !Array.isArray(raw)) {
        const record = raw as Record<string, unknown>;
        for (const [key, maximum] of Object.entries(limits)) {
          const value = record[key];
          if (typeof value === "number" && value > maximum)
            return invalidInput([
              {
                code: "practice_resource_limit",
                field: key,
                message: `Practice candidate ${key} must be <=${maximum} to bound imported integer-factorization/prime-search work; this does not change the source calculator's mathematical domain.`,
              },
            ]);
        }
      }
      return base.execute(raw, context);
    },
  };
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
    return { id, index, input: H.rec(v.input) };
  });
  H.uniqueIds(candidates.map((v) => v.id));
  const rejected: { id: string; index: number; error: ToolError }[] = [],
    eligible: {
      id: string;
      index: number;
      input: Record<string, unknown>;
      answer: unknown;
    }[] = [];
  const reject = (
    c: { id: string; index: number },
    code: string,
    message: string,
  ): void => {
    const result = invalidInput([{ field: "candidatesJson", code, message }]);
    if (!result.ok)
      rejected.push({ id: c.id, index: c.index, error: result.error });
  };
  for (const c of candidates) {
    H.check(!context?.signal?.aborted, "Cancelled");
    const result = bounded.execute(c.input, {
      ...context,
      random: () => {
        throw new Error(
          "Imported educational calculator must not draw randomness",
        );
      },
    });
    if (!result.ok) {
      rejected.push({ id: c.id, index: c.index, error: result.error });
      continue;
    }
    if (!matchesToolJsonSchema(c.input, base.inputSchema)) {
      reject(
        c,
        "practice_source_input_schema",
        "Source execution accepted evidence outside its published input schema; no candidate was sampled.",
      );
      continue;
    }
    if (!matchesToolJsonSchema(result.output, base.outputSchema)) {
      reject(
        c,
        "practice_source_output_schema",
        "Source execution returned a result outside its published output schema; no candidate was sampled.",
      );
      continue;
    }
    try {
      finishEvidence({ prompt: c.input, answer: result.output });
      eligible.push({ ...c, answer: result.output });
    } catch {
      reject(
        c,
        "practice_evidence_budget_exceeded",
        "Imported prompt/answer exceeds the portable practice evidence budget; the source calculation is not reclassified as mathematically invalid.",
      );
    }
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
  const output: PracticeOutput = {
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
      practiceLimits: { ...limits },
    },
  };
  finishEvidence(output.result);
  return output;
};
// Physical magnitudes such as dopant concentration may exceed 2^53 without
// claiming exact-integer semantics. Integer ports remain source-schema checked.
const finishEvidence = (value: unknown): void => {
  let nodes = 0;
  const visit = (v: unknown, depth = 0): void => {
    H.check(depth < 20 && ++nodes <= 50000, "Output evidence budget exceeded");
    if (typeof v === "number")
      H.check(Number.isFinite(v), "Finite numeric evidence required");
    else if (Array.isArray(v)) v.forEach((x) => visit(x, depth + 1));
    else if (v && typeof v === "object")
      Object.values(v).forEach((x) => visit(x, depth + 1));
    else
      H.check(
        v === null ||
          typeof v === "boolean" ||
          (typeof v === "string" && v.length <= 8192),
        "Portable JSON evidence required",
      );
  };
  visit(value);
  H.check(
    JSON.stringify(value).length <= 1048576,
    "Serialized practice output is bounded to 1 MiB of UTF-16 units",
  );
};
