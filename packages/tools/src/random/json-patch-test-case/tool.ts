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
import { simpleError } from "../../core/simple.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  generatedFieldsSchema,
  type GeneratedField,
} from "../typed-field-generation.js";
import {
  validateDocumentFields,
  generateStructuredDocument,
} from "../structured-document-construction.js";
import { calculateJsonDiff, diffJson } from "../../json/diff/tool.js";
import { calculateJsonApplyPatch } from "../../json/apply-patch/tool.js";

export type JsonPatchTestCaseInput = {
  readonly caseCount: number;
  readonly beforeFields: readonly GeneratedField[];
  readonly afterFields: readonly GeneratedField[];
  readonly seed?: number;
};
export type JsonPatchTestCaseOutput = {
  readonly cases: readonly {
    readonly before: string;
    readonly after: string;
    readonly patch: string;
    readonly applied: string;
    readonly opCount: number;
    readonly verified: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    caseCount: { type: "integer", minimum: 1, maximum: 64 },
    beforeFields: { ...generatedFieldsSchema, maxItems: 32 },
    afterFields: { ...generatedFieldsSchema, maxItems: 32 },
    seed: generatorSeedSchema,
  },
  required: ["caseCount", "beforeFields", "afterFields"],
} as const;
const jsonText = {
  type: "string",
  minLength: 1,
  maxLength: 1000000,
  format: "application/json",
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cases: {
      type: "array",
      minItems: 1,
      maxItems: 64,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          before: jsonText,
          after: jsonText,
          patch: jsonText,
          applied: jsonText,
          opCount: { type: "integer", minimum: 0, maximum: 4096 },
          verified: { type: "boolean", const: true },
        },
        required: [
          "before",
          "after",
          "patch",
          "applied",
          "opCount",
          "verified",
        ],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["cases", "randomness"],
} as const;

const isInput = (input: unknown): input is JsonPatchTestCaseInput =>
  matchesModelInput(input, inputSchema);
export const calculateJsonPatchTestCase = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<JsonPatchTestCaseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    validateDocumentFields(input.beforeFields, "beforeFields");
    validateDocumentFields(input.afterFields, "afterFields");
    if (
      input.caseCount * (input.beforeFields.length + input.afterFields.length) >
      4096
    )
      simpleError(
        "caseCount",
        "At most 4,096 generated leaves are supported.",
        "resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context);
    const cases = Array.from({ length: input.caseCount }, () => {
      const before = generateStructuredDocument(
          input.beforeFields,
          random,
          2,
        ).document,
        after = generateStructuredDocument(
          input.afterFields,
          random,
          2,
        ).document;
      const beforeText = JSON.stringify(before),
        afterText = JSON.stringify(after),
        diff = calculateJsonDiff({ a: beforeText, b: afterText });
      const applied = calculateJsonApplyPatch({
        document: beforeText,
        patch: diff.patch,
      });
      const rebuilt: unknown = JSON.parse(applied.result);
      if (
        diffJson(rebuilt, after).length !== 0 ||
        applied.appliedOpCount !== diff.opCount
      )
        throw new Error(
          "Existing JSON diff/apply cores failed generated round-trip verification.",
        );
      return {
        before: beforeText,
        after: afterText,
        patch: diff.patch,
        applied: applied.result,
        opCount: diff.opCount,
        verified: true,
      };
    });
    if (JSON.stringify(cases).length > 1_000_000)
      simpleError(
        "caseCount",
        "Serialized patch cases exceed one million characters.",
        "resource_limit",
      );
    return toolSuccess({
      cases,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const jsonPatchTestCaseExample = {
  input: {
    caseCount: 1,
    beforeFields: [
      {
        key: "profile.name",
        kind: "text",
        choices: ["Ada", "Grace"],
      },
      {
        key: "scores.0",
        kind: "integer",
        minimum: 1,
        maximum: 5,
      },
      {
        key: "scores.1",
        kind: "integer",
        minimum: 1,
        maximum: 5,
      },
    ],
    afterFields: [
      {
        key: "profile.name",
        kind: "text",
        choices: ["Lin", "Hedy"],
      },
      {
        key: "scores.0",
        kind: "integer",
        minimum: 5,
        maximum: 9,
      },
      {
        key: "status.enabled",
        kind: "boolean",
        trueProbability: 0.7,
      },
    ],
    seed: 42,
  },
  output: {
    cases: [
      {
        before: '{"profile":{"name":"Grace"},"scores":[3,5]}',
        after:
          '{"profile":{"name":"Hedy"},"scores":[5],"status":{"enabled":true}}',
        patch:
          '[{"op":"replace","path":"/profile/name","value":"Hedy"},{"op":"remove","path":"/scores/1"},{"op":"replace","path":"/scores/0","value":5},{"op":"add","path":"/status","value":{"enabled":true}}]',
        applied:
          '{"profile":{"name":"Hedy"},"scores":[5],"status":{"enabled":true}}',
        opCount: 4,
        verified: true,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<JsonPatchTestCaseInput, JsonPatchTestCaseOutput>;
export const jsonPatchTestCaseTool = createModelDefinition<
  JsonPatchTestCaseInput,
  JsonPatchTestCaseOutput
>({
  id: "random/json-patch-test-case",
  title: "Random JSON Patch Test Case Generator",
  description:
    "Generate before/after nested JSON documents from explicit bounded field templates, delegate add/remove/replace diff and application, and verify reconstructed structure; inherited-property paths and sparse dot-path arrays are rejected and patches are not claimed globally minimal.",
  inputSchema,
  outputSchema,
  execute: calculateJsonPatchTestCase,
});
export const runJsonPatchTestCase = jsonPatchTestCaseTool.execute;
export default jsonPatchTestCaseTool;
