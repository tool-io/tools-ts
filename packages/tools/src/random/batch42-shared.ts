import { simpleError as throwInputError } from "../core/simple.js";
// An explicitly declared never-returning function lets callers narrow failures.
export function simpleError(
  field: string,
  message: string,
  code?: string,
): never {
  return throwInputError(field, message, code);
}
import type {
  ToolDefinition,
  ToolExecutionContext,
} from "../core/definition.js";
import type { SimpleField } from "../core/simple.js";
import { calculateRandomInteger, type RandomSource } from "./number/tool.js";
import { createSeededRandom } from "./seeded-number/tool.js";
import {
  bounded,
  finish as finishBase,
  validateInput,
} from "../astronomy/batch41-shared.js";
import { selectRandomValue, type RandomValueSource } from "./random-value.js";
export * from "../astronomy/batch41-shared.js";
export const finish = <T extends Readonly<Record<string, unknown>>>(
  value: T,
): T => {
  const result = finishBase(value);
  if (JSON.stringify(result).length > 1048576)
    simpleError(
      "result",
      "Complete serialized output, including composite answers, is bounded to 1 MiB of UTF-16 units.",
    );
  return result;
};
export type SampleInput = Readonly<{
  seed: string;
  count: number;
  withoutReplacement: boolean;
}>;
export const sourceFor = (
  seed: string,
  context?: ToolExecutionContext,
): RandomSource => {
  if (typeof seed !== "string" || !seed.trim() || seed.length > 256)
    simpleError(
      "seed",
      "A nonempty bounded reproducibility seed is required, even when a caller random source is supplied.",
    );
  const base = context?.random ?? createSeededRandom(seed);
  let calls = 0;
  return () => {
    if (++calls > 100000)
      simpleError(
        "random",
        "At most 100,000 random samples per request; degenerate supplied randomness may not converge.",
      );
    const v = base();
    if (!Number.isFinite(v) || v < 0 || v >= 1)
      simpleError("random", "Finite random values in [0,1) required.");
    return v;
  };
};
export const indices = (
  size: number,
  input: SampleInput,
  random: RandomSource,
): number[] => {
  bounded(size, "inventory size", 1, 1000000);
  bounded(input.count, "count", 1, 64);
  if (typeof input.withoutReplacement !== "boolean")
    simpleError("withoutReplacement", "Explicit replacement convention.");
  if (input.withoutReplacement && input.count > size)
    simpleError(
      "count",
      "Cannot draw more distinct entries than the supplied inventory.",
    );
  const result: number[] = [],
    pool = Array.from(
      { length: input.withoutReplacement ? size : 0 },
      (_, i) => i,
    );
  for (let i = 0; i < input.count; i++) {
    const j = calculateRandomInteger(
      0,
      input.withoutReplacement ? pool.length - 1 : size - 1,
      random,
    );
    if (j === null)
      simpleError(
        "random",
        "Random source must produce finite values in [0,1).",
      );
    result.push(input.withoutReplacement ? pool.splice(j, 1)[0] : j);
  }
  return result;
};
export const jsonCases = (
  texts: readonly string[],
): readonly Record<string, unknown>[] => {
  if (!Array.isArray(texts) || texts.length < 1 || texts.length > 128)
    simpleError(
      "candidateInputsJson",
      "1–128 explicit candidate inputs required.",
    );
  let bytes = 0;
  return Array.from({ length: texts.length }, (_, i) => {
    if (
      !Object.hasOwn(texts, i) ||
      typeof texts[i] !== "string" ||
      texts[i].length > 8192
    )
      simpleError(
        "candidateInputsJson",
        "Dense JSON input strings, each at most 8,192 UTF-16 units.",
      );
    bytes += texts[i].length;
    if (bytes > 131072)
      simpleError(
        "candidateInputsJson",
        "Total input corpus is bounded to 131,072 UTF-16 units.",
      );
    let v: unknown;
    try {
      v = JSON.parse(texts[i]);
    } catch {
      simpleError("candidateInputsJson", "Strict JSON object inputs required.");
    }
    if (!v || typeof v !== "object" || Array.isArray(v))
      simpleError(
        "candidateInputsJson",
        "Each candidate must be an object for the imported calculator.",
      );
    const inspect = (x: unknown, depth: number): void => {
      if (depth > 16)
        simpleError("json", "JSON nesting is bounded to 16 levels.");
      if (typeof x === "number" && !Number.isFinite(x))
        simpleError("json", "Finite JSON numbers.");
      if (x && typeof x === "object") {
        for (const [k, val] of Object.entries(x)) {
          if (["__proto__", "constructor", "prototype"].includes(k))
            simpleError("json", "No prototype-control keys in test corpora.");
          inspect(val, depth + 1);
        }
      }
    };
    inspect(v, 0);
    return v as Record<string, unknown>;
  });
};
export const validateRandomInput = (
  input: unknown,
  fields: readonly SimpleField[],
): void => {
  if (!input || typeof input !== "object" || Array.isArray(input))
    simpleError("input", "Explicit input object.");
  const record = input as Record<string, unknown>;
  if (fields.some((f) => !Object.hasOwn(record, f.id)))
    simpleError("input", "Every input field must be an own explicit value.");
  if (Object.keys(record).some((k) => !fields.some((f) => f.id === k)))
    simpleError("input", "No unknown fields.");
  const special = fields.some((f) => f.id === "candidateInputsJson");
  const ordinary = fields.filter((f) => f.id !== "candidateInputsJson");
  validateInput(
    Object.fromEntries(ordinary.map((f) => [f.id, record[f.id]])),
    ordinary,
  );
  if (special) jsonCases(record.candidateInputsJson as readonly string[]);
};
export const repertoire = (
  source: RandomValueSource,
  size: number,
  input: SampleInput,
  context?: ToolExecutionContext,
): {
  result: {
    values: string[];
    selectedEntryIndices: number[];
    repertoireSize: number;
  };
} => {
  const selected = indices(size, input, sourceFor(input.seed, context));
  const values = selected.map((j) => {
    const v = selectRandomValue(source, () => (j + 0.5) / size);
    if (v === null)
      simpleError("repertoire", "Empty or inconsistent pinned repertoire.");
    return v;
  });
  return {
    result: {
      values,
      selectedEntryIndices: selected,
      repertoireSize: size,
    },
  };
};
export const corpus = (
  base: ToolDefinition<unknown, unknown>,
  input: SampleInput & Readonly<{ candidateInputsJson: readonly string[] }>,
  context?: ToolExecutionContext,
): {
  result: {
    baseToolId: string;
    selectedCandidateIndices: number[];
    unusedCandidateIndices: number[];
    exercises: readonly {
      input: Readonly<Record<string, unknown>>;
      answer: unknown;
    }[];
  };
} => {
  const random = sourceFor(input.seed, context),
    cases = jsonCases(input.candidateInputsJson);
  const selected = indices(cases.length, input, random);
  for (const candidate of cases) {
    const result = base.execute(candidate, { random: () => 0.5 });
    if (!result.ok)
      simpleError(
        "candidateInputsJson",
        "Every candidate, including undrawn ones, must satisfy the imported calculator's domain.",
      );
  }
  const exercises = selected.map((i) => {
    const result = base.execute(cases[i], { ...context, random });
    if (!result.ok)
      simpleError(
        "candidateInputsJson",
        "Imported tool rejected the selected scenario or supplied randomness.",
      );
    return { input: cases[i], answer: result.output };
  });
  const result = finish({
    result: {
      baseToolId: base.id,
      selectedCandidateIndices: selected,
      unusedCandidateIndices: Array.from(
        { length: cases.length },
        (_, i) => i,
      ).filter((i) => !selected.includes(i)),
      exercises,
    },
  });
  if (JSON.stringify(result).length > 1048576)
    simpleError(
      "result",
      "Serialized exercise corpus is bounded to 1 MiB of UTF-16 units.",
    );
  return result;
};
