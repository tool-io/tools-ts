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
  choice,
  scalar,
  flatSchema,
  type Scalar,
} from "../m500b-web-json-schema.js";
import { pick, distinct, pretty } from "../m500b-web-json-json.js";
export type JsonNullMissingValueFixtureInput = {
  readonly fields: readonly {
    readonly key: string;
    readonly value: Scalar;
    readonly labels: {
      readonly absent: string;
      readonly null: string;
      readonly empty: string;
      readonly value: string;
    };
  }[];
  readonly modes: readonly ("absent" | "null" | "empty" | "value")[];
  readonly count: number;
  readonly seed?: number;
};
export type JsonNullMissingValueFixtureOutput = {
  readonly documents: readonly {
    readonly document: Readonly<Record<string, Scalar>>;
    readonly pretty: string;
    readonly fields: readonly {
      readonly key: string;
      readonly mode: string;
      readonly present: boolean;
      readonly interpretation: string;
    }[];
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    fields: array(
      object({
        key: label,
        value: scalar,
        labels: object({ absent: text, null: text, empty: text, value: text }),
      }),
      16,
      1,
    ),
    modes: array(choice(["absent", "null", "empty", "value"]), 4, 1),
    count: bounded(1, 32),
    seed: generatorSeedSchema,
  },
  ["fields", "modes", "count"],
);
export const outputSchema = object({
  documents: array(
    object({
      document: flatSchema,
      pretty: text,
      fields: array(
        object({
          key: text,
          mode: text,
          present: boolean,
          interpretation: text,
        }),
        16,
      ),
    }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is JsonNullMissingValueFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateJsonNullMissingValueFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<JsonNullMissingValueFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    distinct(
      input.fields.map((f) => f.key),
      "fields",
    );
    const random = createGeneratorRandom(input.seed, context),
      documents = Array.from({ length: input.count }, () => {
        const entries: [string, Scalar][] = [],
          fields = input.fields.map((f) => {
            const mode = pick(input.modes, random);
            if (mode !== "absent")
              entries.push([
                f.key,
                mode === "null"
                  ? null
                  : mode === "empty"
                    ? ""
                    : f.value === 0
                      ? 0
                      : f.value,
              ]);
            return {
              key: f.key,
              mode,
              present: mode !== "absent",
              interpretation: f.labels[mode],
            };
          }),
          document = Object.fromEntries(entries);
        return { document, pretty: pretty(document), fields };
      });
    return toolSuccess({
      documents,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const jsonNullMissingValueFixtureExample = {
  input: {
    fields: [
      {
        key: "note",
        value: "draft",
        labels: {
          absent: "inherit",
          null: "clear",
          empty: "blank",
          value: "replace",
        },
      },
    ],
    modes: ["absent", "null"],
    count: 1,
    seed: 42,
  },
  output: {
    documents: [
      {
        document: { note: null },
        pretty: '{\n  "note": null\n}\n',
        fields: [
          { key: "note", mode: "null", present: true, interpretation: "clear" },
        ],
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  JsonNullMissingValueFixtureInput,
  JsonNullMissingValueFixtureOutput
>;
export const jsonNullMissingValueFixtureTool = createModelDefinition<
  JsonNullMissingValueFixtureInput,
  JsonNullMissingValueFixtureOutput
>({
  id: "random/json-null-missing-value-fixture",
  title: "Random JSON Null and Missing Value Fixture Generator",
  description:
    "Construct absent, null, empty-string and supplied-value fields with caller-selected interpretation labels and explicit own-property presence.",
  inputSchema,
  outputSchema,
  execute: calculateJsonNullMissingValueFixture,
});
export const runJsonNullMissingValueFixture =
  jsonNullMissingValueFixtureTool.execute;
export default jsonNullMissingValueFixtureTool;
