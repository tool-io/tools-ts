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
import { simpleError } from "../../core/simple.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { budget as fixtureBudget } from "../m500b-web-json-json.js";
import {
  object,
  array,
  text,
  label,
  bounded,
  boolean,
  scalar,
  flatSchema,
  type Scalar,
} from "../m500b-web-json-schema.js";
import { distinct, pretty } from "../m500b-web-json-json.js";
export type JsonOptionalFieldCoverageFixtureInput = {
  readonly fields: readonly {
    readonly key: string;
    readonly value: Scalar;
    readonly required: boolean;
  }[];
  readonly probability: number;
  readonly count: number;
  readonly seed?: number;
};
export type JsonOptionalFieldCoverageFixtureOutput = {
  readonly documents: readonly {
    readonly document: Readonly<Record<string, Scalar>>;
    readonly pretty: string;
    readonly presentKeys: readonly string[];
  }[];
  readonly coverage: readonly {
    readonly key: string;
    readonly present: number;
    readonly absent: number;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    fields: array(
      object({ key: label, value: scalar, required: boolean }),
      16,
      1,
    ),
    probability: { type: "number", minimum: 0, maximum: 1 },
    count: bounded(1, 32),
    seed: generatorSeedSchema,
  },
  ["fields", "probability", "count"],
);
export const outputSchema = object({
  documents: array(
    object({
      document: flatSchema,
      pretty: text,
      presentKeys: array(text, 16),
    }),
    32,
    1,
  ),
  coverage: array(
    object({ key: text, present: bounded(0, 32), absent: bounded(0, 32) }),
    16,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (
  input: unknown,
): input is JsonOptionalFieldCoverageFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateJsonOptionalFieldCoverageFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<JsonOptionalFieldCoverageFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    distinct(
      input.fields.map((f) => f.key),
      "fields",
    );
    const random = createGeneratorRandom(input.seed, context);
    const documents = Array.from({ length: input.count }, () => {
      const selected = input.fields.filter((f) => {
          const draw = random.unit();
          return f.required || draw < input.probability;
        }),
        document = Object.fromEntries(
          selected.map((f) => [f.key, f.value === 0 ? 0 : f.value]),
        );
      return {
        document,
        pretty: pretty(document),
        presentKeys: selected.map((f) => f.key),
      };
    });
    const coverage = input.fields.map((f) => {
      const present = documents.filter((d) =>
        Object.hasOwn(d.document, f.key),
      ).length;
      return { key: f.key, present, absent: input.count - present };
    });
    return toolSuccess({
      documents,
      coverage,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const jsonOptionalFieldCoverageFixtureExample = {
  input: {
    fields: [
      { key: "id", value: 7, required: true },
      { key: "note", value: "draft", required: false },
    ],
    probability: 0.5,
    count: 1,
    seed: 42,
  },
  output: {
    documents: [
      {
        document: { id: 7, note: "draft" },
        pretty: '{\n  "id": 7,\n  "note": "draft"\n}\n',
        presentKeys: ["id", "note"],
      },
    ],
    coverage: [
      { key: "id", present: 1, absent: 0 },
      { key: "note", present: 1, absent: 0 },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  JsonOptionalFieldCoverageFixtureInput,
  JsonOptionalFieldCoverageFixtureOutput
>;
export const jsonOptionalFieldCoverageFixtureTool = createModelDefinition<
  JsonOptionalFieldCoverageFixtureInput,
  JsonOptionalFieldCoverageFixtureOutput
>({
  id: "random/json-optional-field-coverage-fixture",
  title: "Random JSON Optional Field Coverage Fixture Generator",
  description:
    "Sample supplied optional-field presence independently while retaining required fields and exact present/absent coverage counts.",
  inputSchema,
  outputSchema,
  execute: calculateJsonOptionalFieldCoverageFixture,
});
export const runJsonOptionalFieldCoverageFixture =
  jsonOptionalFieldCoverageFixtureTool.execute;
export default jsonOptionalFieldCoverageFixtureTool;
