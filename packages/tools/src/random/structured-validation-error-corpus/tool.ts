import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
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
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorRandom,
  type GeneratorReplay,
} from "../generator-random.js";
import { runNumberParser } from "../../parse/number/tool.js";
import {
  calculateValidateUuid,
  type ValidateUuidOutput,
} from "../../validate/uuid/tool.js";
import {
  runIpAddressValidation,
  type IpAddressValidationOutput,
} from "../../validate/ip-address/tool.js";
import { simpleError } from "../../core/simple.js";
import {
  mocksArray,
  mocksObject,
  mocksText,
  mocksBoolean,
  mocksInteger,
  mocksNumber,
  mocksPick,
  mocksFinish,
} from "../m250-parser-mocks-support.js";
export type ValidationCorpusKind = "number" | "uuid" | "ip";
export type ValidationObservation = ToolResult<
  { readonly value: number } | ValidateUuidOutput | IpAddressValidationOutput
>;
export type StructuredValidationErrorCorpusInput = {
  readonly originals: readonly {
    readonly kind: ValidationCorpusKind;
    readonly text: string;
  }[];
  readonly count: number;
  readonly seed?: number;
};
export type StructuredValidationErrorCorpusOutput = {
  readonly cases: readonly {
    readonly kind: ValidationCorpusKind;
    readonly original: string;
    readonly originalResult: ValidationObservation;
    readonly mutation: "append" | "delete";
    readonly position: number;
    readonly text: string;
    readonly result: ValidationObservation;
  }[];
  readonly randomness: GeneratorReplay;
};
const kinds = { type: "string", enum: ["number", "uuid", "ip"] } as const;
const observationSchema = {
  anyOf: [
    mocksObject({
      ok: { type: "boolean", const: true },
      output: {
        anyOf: [
          mocksObject({ value: mocksNumber }),
          mocksObject({
            normalized: mocksText,
            valid: mocksBoolean,
            version: mocksInteger,
          }),
          mocksObject({
            normalized: mocksText,
            scope: mocksText,
            version: { type: "string", enum: ["IPv4", "IPv6"] },
            isPublic: mocksBoolean,
          }),
        ],
      },
    }),
    mocksObject({
      ok: { type: "boolean", const: false },
      error: mocksObject({
        code: { type: "string", const: "invalid_input" },
        issues: mocksArray(
          mocksObject({
            code: mocksText,
            field: mocksText,
            message: mocksText,
          }),
        ),
      }),
    }),
  ],
} as const;
export const inputSchema = mocksObject(
  {
    originals: mocksArray(
      mocksObject({
        kind: kinds,
        text: { ...mocksText, minLength: 1, maxLength: 512 },
      }),
      128,
      1,
    ),
    count: { type: "integer", minimum: 1, maximum: 128 },
    seed: generatorSeedSchema,
  },
  ["originals", "count"],
);
export const outputSchema = mocksObject({
  cases: mocksArray(
    mocksObject({
      kind: kinds,
      original: mocksText,
      originalResult: observationSchema,
      mutation: { type: "string", enum: ["append", "delete"] },
      position: mocksInteger,
      text: mocksText,
      result: observationSchema,
    }),
    128,
    1,
  ),
  randomness: generatorReplaySchema,
});
const observation = (
  kind: ValidationCorpusKind,
  text: string,
): ValidationObservation => {
  const result =
    kind === "uuid"
      ? calculateValidateUuid({ uuid: text })
      : kind === "number"
        ? runNumberParser({ text, format: "plain" })
        : runIpAddressValidation({ ipAddress: text });
  if (!result.ok) {
    if (
      result.error.issues.some((issue) => issue.code === "calculation_failed")
    )
      throw new Error("Unexpected validation core failure.");
    return result;
  }
  if ("value" in result.output) {
    const value = result.output.value;
    if (value === null || !Number.isFinite(value))
      throw new Error(
        "Successful numeric validator result must contain a finite number.",
      );
    return toolSuccess({ value });
  }
  return toolSuccess(result.output);
};
const generate = (
  input: StructuredValidationErrorCorpusInput,
  random: GeneratorRandom,
): Omit<StructuredValidationErrorCorpusOutput, "randomness"> => {
  for (const original of input.originals) {
    if (
      original.kind === "uuid" &&
      !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}(?![\s\S])/.test(
        original.text,
      )
    )
      simpleError(
        "originals",
        "UUID originals must use the exact complete hexadecimal layout.",
        "invalid_original",
      );
    const result = observation(original.kind, original.text);
    if (!result.ok || ("valid" in result.output && !result.output.valid))
      simpleError(
        "originals",
        "All supplied originals must be accepted as valid by their selected core.",
        "invalid_original",
      );
  }
  return {
    cases: Array.from({ length: input.count }, () => {
      const original = mocksPick(input.originals, random),
        mutation = mocksPick(["append", "delete"] as const, random);
      const position =
        mutation === "append"
          ? original.text.length
          : random.integer(0, original.text.length - 1);
      const text =
        mutation === "append"
          ? original.text + "!"
          : original.text.slice(0, position) +
            original.text.slice(position + 1);
      return {
        kind: original.kind,
        original: original.text,
        originalResult: observation(original.kind, original.text),
        mutation,
        position,
        text,
        result: observation(original.kind, text),
      };
    }),
  };
};
export const structuredValidationErrorCorpusExample = {
  input: {
    originals: [
      { kind: "number", text: "12.5" },
      { kind: "uuid", text: "550e8400-e29b-41d4-a716-446655440000" },
    ],
    count: 1,
    seed: 42,
  },
  output: {
    cases: [
      {
        kind: "uuid",
        original: "550e8400-e29b-41d4-a716-446655440000",
        originalResult: {
          ok: true,
          output: {
            valid: true,
            normalized: "550e8400-e29b-41d4-a716-446655440000",
            version: 4,
          },
        },
        mutation: "append",
        position: 36,
        text: "550e8400-e29b-41d4-a716-446655440000!",
        result: {
          ok: true,
          output: { valid: false, normalized: "", version: 0 },
        },
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  StructuredValidationErrorCorpusInput,
  StructuredValidationErrorCorpusOutput
>;

const isInput = (
  input: unknown,
): input is StructuredValidationErrorCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateStructuredValidationErrorCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<StructuredValidationErrorCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    return mocksFinish(
      {
        ...generate(input, random),
        randomness: generatorReplay(input.seed, context),
      },
      outputSchema,
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const structuredValidationErrorCorpusTool = createModelDefinition<
  StructuredValidationErrorCorpusInput,
  StructuredValidationErrorCorpusOutput
>({
  id: "random/structured-validation-error-corpus",
  title: "Random Structured Validation Error Corpus Generator",
  description:
    "Mutate supplied valid number, UUID, and IP strings and retain each allowlisted core's success shape, validity flag, and structured issues.",
  inputSchema,
  outputSchema,
  execute: calculateStructuredValidationErrorCorpus,
});
export const runStructuredValidationErrorCorpus =
  structuredValidationErrorCorpusTool.execute;
export default structuredValidationErrorCorpusTool;
