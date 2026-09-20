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
  choice,
  nullableText,
  flatSchema,
  scalar,
  type Scalar,
} from "../m500b-web-json-schema.js";
import { pick, distinct, pretty } from "../m500b-web-json-json.js";
export type JsonSchemaUnionBranchFixtureInput = {
  readonly discriminator: string;
  readonly branches: readonly {
    readonly tag: string;
    readonly payloadKey: string;
    readonly payload: Scalar;
    readonly label: string;
  }[];
  readonly modes: readonly ("valid" | "missing" | "unknown" | "conflicting")[];
  readonly count: number;
  readonly seed?: number;
};
export type JsonSchemaUnionBranchFixtureOutput = {
  readonly documents: readonly {
    readonly mode: string;
    readonly document: Readonly<Record<string, Scalar>>;
    readonly pretty: string;
    readonly selectedTag: string | null;
    readonly branchLabel: string | null;
    readonly valid: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    discriminator: label,
    branches: array(
      object({ tag: label, payloadKey: label, payload: scalar, label: label }),
      16,
      1,
    ),
    modes: array(choice(["valid", "missing", "unknown", "conflicting"]), 4, 1),
    count: bounded(1, 32),
    seed: generatorSeedSchema,
  },
  ["discriminator", "branches", "modes", "count"],
);
export const outputSchema = object({
  documents: array(
    object({
      mode: text,
      document: flatSchema,
      pretty: text,
      selectedTag: nullableText,
      branchLabel: nullableText,
      valid: { type: "boolean" },
    }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is JsonSchemaUnionBranchFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateJsonSchemaUnionBranchFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<JsonSchemaUnionBranchFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    distinct(
      input.branches.map((b) => b.tag),
      "branches",
    );
    if (input.branches.some((b) => b.payloadKey === input.discriminator))
      simpleError(
        "discriminator",
        "Discriminator and payload keys must differ.",
        "key_conflict",
      );
    if (
      input.modes.includes("conflicting") &&
      (input.branches.length < 2 ||
        new Set(input.branches.map((b) => b.payloadKey)).size !==
          input.branches.length)
    )
      simpleError(
        "branches",
        "Conflicting payload controls need distinct branch payload keys.",
        "ambiguous_branches",
      );
    const random = createGeneratorRandom(input.seed, context);
    let unknown = "__unknown__";
    while (input.branches.some((b) => b.tag === unknown)) unknown += "_";
    const documents = Array.from({ length: input.count }, () => {
      const branch = pick(input.branches, random),
        mode = pick(input.modes, random),
        entries: readonly (readonly [string, Scalar])[] = [
          [input.discriminator, branch.tag],
          [branch.payloadKey, branch.payload === 0 ? 0 : branch.payload],
        ],
        document: Record<string, Scalar> = Object.fromEntries(entries);
      if (mode === "missing") delete document[input.discriminator];
      else if (mode === "unknown")
        Object.defineProperty(document, input.discriminator, {
          value: unknown,
          enumerable: true,
          writable: true,
          configurable: true,
        });
      else if (mode === "conflicting") {
        const other = pick(
          input.branches.filter((b) => b.tag !== branch.tag),
          random,
        );
        Object.defineProperty(document, other.payloadKey, {
          value: other.payload === 0 ? 0 : other.payload,
          enumerable: true,
          writable: true,
          configurable: true,
        });
      }
      const selected = input.branches.find(
          (b) =>
            Object.hasOwn(document, input.discriminator) &&
            document[input.discriminator] === b.tag,
        ),
        valid = selected !== undefined && mode !== "conflicting";
      return {
        mode,
        document,
        pretty: pretty(document),
        selectedTag: selected?.tag ?? null,
        branchLabel: selected?.label ?? null,
        valid,
      };
    });
    return toolSuccess({
      documents,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const jsonSchemaUnionBranchFixtureExample = {
  input: {
    discriminator: "kind",
    branches: [
      { tag: "red", payloadKey: "redValue", payload: 2, label: "Red branch" },
      {
        tag: "blue",
        payloadKey: "blueValue",
        payload: "b",
        label: "Blue branch",
      },
    ],
    modes: ["valid"],
    count: 1,
    seed: 42,
  },
  output: {
    documents: [
      {
        mode: "valid",
        document: { kind: "blue", blueValue: "b" },
        pretty: '{\n  "kind": "blue",\n  "blueValue": "b"\n}\n',
        selectedTag: "blue",
        branchLabel: "Blue branch",
        valid: true,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  JsonSchemaUnionBranchFixtureInput,
  JsonSchemaUnionBranchFixtureOutput
>;
export const jsonSchemaUnionBranchFixtureTool = createModelDefinition<
  JsonSchemaUnionBranchFixtureInput,
  JsonSchemaUnionBranchFixtureOutput
>({
  id: "random/json-schema-union-branch-fixture",
  title: "Random JSON Schema Union Branch Fixture Generator",
  description:
    "Construct caller-labeled tagged-union documents with missing, unknown or conflicting payload controls and explicit branch-selection keys.",
  inputSchema,
  outputSchema,
  execute: calculateJsonSchemaUnionBranchFixture,
});
export const runJsonSchemaUnionBranchFixture =
  jsonSchemaUnionBranchFixtureTool.execute;
export default jsonSchemaUnionBranchFixtureTool;
