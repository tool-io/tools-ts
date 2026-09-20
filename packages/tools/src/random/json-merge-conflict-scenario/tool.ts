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
  bounded,
  boolean,
  choice,
  entrySchema,
  flatSchema,
  scalar,
  type Entry,
  type Scalar,
} from "../m500b-web-json-schema.js";
import { pick, entriesObject, pretty } from "../m500b-web-json-json.js";
export type JsonMergeConflictScenarioInput = {
  readonly base: readonly Entry[];
  readonly changes: { readonly left: Scalar; readonly right: Scalar };
  readonly forceOverlap: boolean;
  readonly operations: readonly ("set" | "delete")[];
  readonly resolution: "left" | "right" | "base";
  readonly seed?: number;
};
export type JsonMergeConflictScenarioOutput = {
  readonly base: Readonly<Record<string, Scalar>>;
  readonly left: Readonly<Record<string, Scalar>>;
  readonly right: Readonly<Record<string, Scalar>>;
  readonly edits: readonly {
    readonly side: string;
    readonly key: string;
    readonly operation: string;
  }[];
  readonly overlappingPaths: readonly string[];
  readonly conflicts: readonly string[];
  readonly merged: Readonly<Record<string, Scalar>>;
  readonly pretty: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    base: array(entrySchema, 16, 1),
    changes: object({ left: scalar, right: scalar }),
    forceOverlap: boolean,
    operations: array(choice(["set", "delete"]), 2, 1),
    resolution: choice(["left", "right", "base"]),
    seed: generatorSeedSchema,
  },
  ["base", "changes", "forceOverlap", "operations", "resolution"],
);
export const outputSchema = object({
  base: flatSchema,
  left: flatSchema,
  right: flatSchema,
  edits: array(object({ side: text, key: text, operation: text }), 2, 2),
  overlappingPaths: array(text, 16),
  conflicts: array(text, 16),
  merged: flatSchema,
  pretty: text,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is JsonMergeConflictScenarioInput =>
  matchesModelInput(input, inputSchema);
export const calculateJsonMergeConflictScenario = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<JsonMergeConflictScenarioOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    const base = entriesObject(input.base, "base"),
      random = createGeneratorRandom(input.seed, context),
      leftKey = pick(input.base, random).key,
      rightKey = input.forceOverlap ? leftKey : pick(input.base, random).key,
      leftOp = pick(input.operations, random),
      rightOp = pick(input.operations, random);
    const left: Record<string, Scalar> = { ...base },
      right: Record<string, Scalar> = { ...base };
    const edit = (
      doc: Record<string, Scalar>,
      key: string,
      operation: string,
      value: Scalar,
    ) => {
      if (operation === "delete") delete doc[key];
      else
        Object.defineProperty(doc, key, {
          value: value === 0 ? 0 : value,
          enumerable: true,
          configurable: true,
          writable: true,
        });
    };
    edit(left, leftKey, leftOp, input.changes.left);
    edit(right, rightKey, rightOp, input.changes.right);
    const same = (
        a: Readonly<Record<string, Scalar>>,
        b: Readonly<Record<string, Scalar>>,
        key: string,
      ) => Object.hasOwn(a, key) === Object.hasOwn(b, key) && a[key] === b[key],
      overlappingPaths: string[] = [],
      conflicts: string[] = [],
      merged: Record<string, Scalar> = { ...base };
    for (const key of Object.keys(base)) {
      const l = !same(base, left, key),
        r = !same(base, right, key);
      if (l && r) overlappingPaths.push(key);
      const conflict = l && r && !same(left, right, key);
      if (conflict) conflicts.push(key);
      const winner = conflict
        ? input.resolution === "left"
          ? left
          : input.resolution === "right"
            ? right
            : base
        : r
          ? right
          : l
            ? left
            : base;
      if (Object.hasOwn(winner, key))
        Object.defineProperty(merged, key, {
          value: winner[key],
          enumerable: true,
          writable: true,
          configurable: true,
        });
      else delete merged[key];
    }
    return toolSuccess({
      base,
      left,
      right,
      edits: [
        { side: "left", key: leftKey, operation: leftOp },
        { side: "right", key: rightKey, operation: rightOp },
      ],
      overlappingPaths,
      conflicts,
      merged,
      pretty: pretty(merged),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const jsonMergeConflictScenarioExample = {
  input: {
    base: [
      { key: "theme", value: "light" },
      { key: "size", value: 2 },
    ],
    changes: { left: "blue", right: "dark" },
    forceOverlap: true,
    operations: ["set"],
    resolution: "right",
    seed: 42,
  },
  output: {
    base: { theme: "light", size: 2 },
    left: { theme: "light", size: "blue" },
    right: { theme: "light", size: "dark" },
    edits: [
      { side: "left", key: "size", operation: "set" },
      { side: "right", key: "size", operation: "set" },
    ],
    overlappingPaths: ["size"],
    conflicts: ["size"],
    merged: { theme: "light", size: "dark" },
    pretty: '{\n  "theme": "light",\n  "size": "dark"\n}\n',
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  JsonMergeConflictScenarioInput,
  JsonMergeConflictScenarioOutput
>;
export const jsonMergeConflictScenarioTool = createModelDefinition<
  JsonMergeConflictScenarioInput,
  JsonMergeConflictScenarioOutput
>({
  id: "random/json-merge-conflict-scenario",
  title: "Random JSON Merge Conflict Scenario Generator",
  description:
    "Construct flat base/left/right edits and report true three-way conflicts with explicit left, right or base resolution policy.",
  inputSchema,
  outputSchema,
  execute: calculateJsonMergeConflictScenario,
});
export const runJsonMergeConflictScenario =
  jsonMergeConflictScenarioTool.execute;
export default jsonMergeConflictScenarioTool;
