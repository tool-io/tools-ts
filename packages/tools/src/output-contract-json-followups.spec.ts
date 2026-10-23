import { describe, expect, expectTypeOf, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "./core/contract.js";
import type { ToolContract } from "./core/definition.js";
import { exampleOutputsMatch } from "./core/example.js";
import type { Json, JsonScalar } from "./json/batch53-shared.js";
import * as tuple from "./identifier/typed-tuple-key-decoder/tool.js";
import * as ini from "./ini/line-kind-tokenizer/tool.js";
import * as spans from "./json/json-array-scalar-duplicate-spans/tool.js";
import * as defaults from "./json/object-default-fill-missing/tool.js";
import * as prefix from "./json/object-key-prefix-partitioner/tool.js";
import * as rename from "./json/object-key-rename-map/tool.js";
import * as prune from "./json/object-null-member-pruner/tool.js";
import * as index from "./json/object-record-array-indexer/tool.js";
import * as pointer from "./json/pointer-parent-and-final-token/tool.js";
import * as coalesce from "./json/record-field-coalesce/tool.js";
import * as project from "./json/record-field-projection/tool.js";
import * as lookup from "./json/record-first-match-lookup/tool.js";
import * as multiplicity from "./json/record-key-multiplicity-audit/tool.js";
import * as antiJoin from "./json/record-left-anti-join/tool.js";
import * as sort from "./json/record-stable-key-sort/tool.js";
import * as log from "./log/log-record-level-count-table/tool.js";
import * as cnf from "./logic/cnf-conversion-steps-counter/tool.js";
import * as expand from "./multiset/count-table-expander/tool.js";
import * as counts from "./multiset/typed-value-count-table/tool.js";
import * as trie from "./trie/literal-word-node-table/tool.js";

const modules = [
  tuple,
  ini,
  spans,
  defaults,
  prefix,
  rename,
  prune,
  index,
  pointer,
  coalesce,
  project,
  lookup,
  multiplicity,
  antiJoin,
  sort,
  log,
  cnf,
  expand,
  counts,
  trie,
];

describe("reviewed JSON and text output contracts", () => {
  it.each(modules)(
    "closes the result structure for $tool.id",
    ({ tool, example }) => {
      expect(validateToolContract(tool)).toEqual([]);
      const execution = tool.execute(example.input);
      expect(execution.ok).toBe(true);
      if (!execution.ok) throw new Error(`Example failed: ${tool.id}`);
      expect(exampleOutputsMatch(execution.output, example.output)).toBe(true);
      expect(matchesToolJsonSchema(execution.output, tool.outputSchema)).toBe(
        true,
      );
      expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(
        true,
      );
      const result = tool.outputSchema.properties?.result;
      expect(result?.additionalProperties).toBe(false);
      expect(Object.keys(result?.properties ?? {}).length).toBeGreaterThan(0);
      expect(
        matchesToolJsonSchema(
          { result: { ...example.output.result, extra: true } },
          tool.outputSchema,
        ),
      ).toBe(false);
      for (const key of result?.required ?? []) {
        const missing = Object.fromEntries(
          Object.entries(example.output.result).filter(
            ([name]) => name !== key,
          ),
        );
        expect(
          matchesToolJsonSchema({ result: missing }, tool.outputSchema),
          key,
        ).toBe(false);
      }
    },
  );

  it("retains scalar, record and conditional output types", () => {
    expectTypeOf<tuple.Output["result"]["values"]>().toEqualTypeOf<
      JsonScalar[]
    >();
    expectTypeOf<ini.Output["result"]["lines"][number]["kind"]>().toEqualTypeOf<
      "blank" | "comment" | "section" | "assignment"
    >();
    expectTypeOf<
      spans.Output["result"]["runs"][number]["value"]
    >().toEqualTypeOf<JsonScalar>();
    expectTypeOf<defaults.Output["result"]["object"]>().toEqualTypeOf<
      Record<string, Json>
    >();
    expectTypeOf<prefix.Output["result"]["matching"]>().toEqualTypeOf<
      Record<string, Json>
    >();
    expectTypeOf<rename.Output["result"]["object"]>().toEqualTypeOf<
      Record<string, Json>
    >();
    expectTypeOf<prune.Output["result"]["object"]>().toEqualTypeOf<
      Record<string, Json>
    >();
    expectTypeOf<
      index.Output["result"]["index"][number]["key"]
    >().toEqualTypeOf<JsonScalar>();
    expectTypeOf<pointer.Output["result"]["finalToken"]>().toEqualTypeOf<
      string | null
    >();
    expectTypeOf<coalesce.Output["result"]["records"]>().toEqualTypeOf<
      Record<string, Json>[]
    >();
    expectTypeOf<project.Output["result"]["records"]>().toEqualTypeOf<
      Record<string, Json>[]
    >();
    expectTypeOf<lookup.Output["result"]["record"]>().toEqualTypeOf<Record<
      string,
      Json
    > | null>();
    expectTypeOf<
      multiplicity.Output["result"]["groups"][number]["key"]
    >().toEqualTypeOf<JsonScalar>();
    expectTypeOf<antiJoin.Output["result"]["records"]>().toEqualTypeOf<
      Record<string, Json>[]
    >();
    expectTypeOf<sort.Output["result"]["records"]>().toEqualTypeOf<
      Record<string, Json>[]
    >();
    expectTypeOf<
      log.Output["result"]["counts"][number]["level"]
    >().toEqualTypeOf<string | null>();
    expectTypeOf<
      cnf.Output["result"]["distributionEvents"]
    >().toEqualTypeOf<number>();
    expectTypeOf<expand.Output["result"]["values"]>().toEqualTypeOf<
      JsonScalar[]
    >();
    expectTypeOf<
      counts.Output["result"]["counts"][number]["value"]
    >().toEqualTypeOf<JsonScalar>();
    expectTypeOf<
      trie.Output["result"]["nodes"][number]["parent"]
    >().toEqualTypeOf<number | null>();
  });

  it.each([
    { tool: tuple.tool, input: { key: "t:0:" }, expected: { values: [] } },
    {
      tool: tuple.tool,
      input: { key: "t:4:3:n:15:s:1:13:b:02:z:" },
      expected: { values: [1, "1", false, null] },
    },
    {
      tool: ini.tool,
      input: { text: "\n# c\n[a]\nx =\n" },
      expected: {
        lines: [
          { index: 0, kind: "blank" },
          { index: 1, kind: "comment" },
          { index: 2, kind: "section", section: "a" },
          { index: 3, kind: "assignment", name: "x", value: "" },
          { index: 4, kind: "blank" },
        ],
      },
    },
    { tool: spans.tool, input: { arrayJson: "[]" }, expected: { runs: [] } },
    {
      tool: spans.tool,
      input: { arrayJson: '[true,true,false,null,null,"x","x",0,0]' },
      expected: {
        runs: [
          { start: 0, end: 2, value: true },
          { start: 3, end: 5, value: null },
          { start: 5, end: 7, value: "x" },
          { start: 7, end: 9, value: 0 },
        ],
      },
    },
    {
      tool: defaults.tool,
      input: {
        objectJson: '{"a":null,"b":false,"c":0,"d":""}',
        defaultsJson: '{"a":1,"b":1,"c":1,"d":1,"e":[{"x":null}]}',
      },
      expected: {
        object: { a: null, b: false, c: 0, d: "", e: [{ x: null }] },
        filledKeys: ["e"],
      },
    },
    {
      tool: prefix.tool,
      input: { objectJson: '{"a":[1,{"b":null}]}', prefix: "" },
      expected: { matching: { a: [1, { b: null }] }, other: {} },
    },
    {
      tool: rename.tool,
      input: {
        objectJson: '{"a":{"deep":[true,null]},"b":false}',
        oldKeys: ["a"],
        newKeys: ["c"],
      },
      expected: { object: { c: { deep: [true, null] }, b: false } },
    },
    {
      tool: prune.tool,
      input: { objectJson: '{"a":null,"b":false,"c":0,"d":"","e":{"a":null}}' },
      expected: {
        object: { b: false, c: 0, d: "", e: { a: null } },
        removedKeys: ["a"],
      },
    },
    {
      tool: index.tool,
      input: {
        recordsJson: '[{"id":null},{"id":false},{"id":0},{"id":"0"}]',
        keyField: "id",
      },
      expected: {
        index: [
          { key: null, recordIndex: 0 },
          { key: false, recordIndex: 1 },
          { key: 0, recordIndex: 2 },
          { key: "0", recordIndex: 3 },
        ],
      },
    },
    {
      tool: index.tool,
      input: { recordsJson: "[]", keyField: "id" },
      expected: { index: [] },
    },
    {
      tool: pointer.tool,
      input: { pointer: "" },
      expected: { hasParent: false, parent: null, finalToken: null },
    },
    {
      tool: pointer.tool,
      input: { pointer: "/" },
      expected: { hasParent: true, parent: "", finalToken: "" },
    },
    {
      tool: pointer.tool,
      input: { pointer: "/a~1b/~0" },
      expected: { hasParent: true, parent: "/a~1b", finalToken: "~" },
    },
    {
      tool: coalesce.tool,
      input: {
        recordsJson:
          '[{"a":false},{"a":0},{"a":""},{"a":{"nested":[1,null]}},{}]',
        candidateFields: ["a"],
        targetField: "x",
      },
      expected: {
        records: [
          { a: false, x: false },
          { a: 0, x: 0 },
          { a: "", x: "" },
          { a: { nested: [1, null] }, x: { nested: [1, null] } },
          { x: null },
        ],
      },
    },
    {
      tool: project.tool,
      input: {
        recordsJson: '[{"data":[[1],{"a":null}],"extra":0},{}]',
        fields: ["data", "missing"],
      },
      expected: { records: [{ data: [[1], { a: null }] }, {}] },
    },
    {
      tool: lookup.tool,
      input: { recordsJson: '[{"id":1}]', keyField: "id", queryJson: '"1"' },
      expected: { found: false, recordIndex: null, record: null },
    },
    {
      tool: lookup.tool,
      input: {
        recordsJson: '[{"id":null,"payload":[[false]]}]',
        keyField: "id",
        queryJson: "null",
      },
      expected: {
        found: true,
        recordIndex: 0,
        record: { id: null, payload: [[false]] },
      },
    },
    {
      tool: multiplicity.tool,
      input: {
        recordsJson: '[{"id":null},{"id":false},{},{"id":null}]',
        keyField: "id",
      },
      expected: {
        groups: [
          { key: null, indexes: [0, 3], count: 2 },
          { key: false, indexes: [1], count: 1 },
        ],
        missingRecordIndexes: [2],
      },
    },
    {
      tool: multiplicity.tool,
      input: { recordsJson: "[]", keyField: "id" },
      expected: { groups: [], missingRecordIndexes: [] },
    },
    {
      tool: antiJoin.tool,
      input: {
        leftRecordsJson: '[{"id":1},{"id":"1","nested":[null]},{}]',
        rightRecordsJson: '[{"id":1}]',
        leftKey: "id",
        rightKey: "id",
      },
      expected: {
        records: [{ id: "1", nested: [null] }, {}],
        sourceIndexes: [1, 2],
      },
    },
    {
      tool: sort.tool,
      input: {
        recordsJson:
          '[{"id":2,"name":"a"},{"id":1,"name":"b"},{"id":2,"name":"c"}]',
        keyField: "id",
        descending: true,
      },
      expected: {
        records: [
          { id: 2, name: "a" },
          { id: 2, name: "c" },
          { id: 1, name: "b" },
        ],
        sourceIndexes: [0, 2, 1],
      },
    },
    {
      tool: log.tool,
      input: { recordsJson: "[]", aliasesJson: "[]" },
      expected: { counts: [] },
    },
    {
      tool: log.tool,
      input: {
        ...log.example.input,
        aliasesJson:
          '[{"name":"info","target":"warn"},{"name":"warn","target":"info"}]',
      },
      expected: {
        counts: [{ level: null, aliasCycle: true, count: 2, indexes: [0, 1] }],
      },
    },
    {
      tool: cnf.tool,
      input: { expression: "A" },
      expected: { clauseCount: 1, literalCount: 1, distributionEvents: 0 },
    },
    {
      tool: cnf.tool,
      input: { expression: "!(A|B)" },
      expected: { clauseCount: 2, literalCount: 2, distributionEvents: 0 },
    },
    {
      tool: expand.tool,
      input: { countsJson: "[]" },
      expected: { values: [] },
    },
    {
      tool: expand.tool,
      input: {
        countsJson:
          '[{"value":null,"count":0},{"value":false,"count":2},{"value":0,"count":1},{"value":"0","count":1}]',
      },
      expected: { values: [false, false, 0, "0"] },
    },
    {
      tool: counts.tool,
      input: { valuesJson: "[]" },
      expected: { counts: [] },
    },
    {
      tool: counts.tool,
      input: { valuesJson: '[false,0,"0",null,false]' },
      expected: {
        counts: [
          { value: false, count: 2 },
          { value: 0, count: 1 },
          { value: "0", count: 1 },
          { value: null, count: 1 },
        ],
      },
    },
    {
      tool: trie.tool,
      input: { words: [] },
      expected: {
        nodes: [{ id: 0, parent: null, character: "", terminal: false }],
      },
    },
    {
      tool: trie.tool,
      input: { words: [""] },
      expected: {
        nodes: [{ id: 0, parent: null, character: "", terminal: true }],
      },
    },
    {
      tool: trie.tool,
      input: { words: ["💡"] },
      expected: {
        nodes: [
          { id: 0, parent: null, character: "", terminal: false },
          { id: 1, parent: 0, character: "\ud83d", terminal: false },
          { id: 2, parent: 1, character: "\udca1", terminal: true },
        ],
      },
    },
  ])(
    "preserves empty, typed and conditional results: $tool.id ($input)",
    ({ tool, input, expected }) => {
      expect(tool.execute(input)).toEqual({
        ok: true,
        output: { result: expected },
      });
      expect(
        matchesToolJsonSchema({ result: expected }, tool.outputSchema),
      ).toBe(true);
    },
  );

  it("allows arbitrary JSON record members, including own prototype-shadowing keys", () => {
    const objectJson =
      '{"__proto__":{"polluted":true},"constructor":[null,false,0,"",{"deep":[[]]}]}';
    const expected = JSON.parse(objectJson);
    const result = defaults.tool.execute({ objectJson, defaultsJson: "{}" });
    expect(result).toEqual({
      ok: true,
      output: { result: { object: expected, filledKeys: [] } },
    });
    expect(Object.hasOwn(expected, "__proto__")).toBe(true);
    expect(Object.hasOwn(Object.prototype, "polluted")).toBe(false);
  });

  it("does not permit objects or arrays where scalar values are promised", () => {
    const invalid: readonly [ToolContract, unknown][] = [
      [tuple.tool, { values: [{}] }],
      [tuple.tool, { values: [[]] }],
      [spans.tool, { runs: [{ start: 0, end: 2, value: {} }] }],
      [index.tool, { index: [{ key: [], recordIndex: 0 }] }],
      [
        multiplicity.tool,
        {
          groups: [{ key: {}, indexes: [0], count: 1 }],
          missingRecordIndexes: [],
        },
      ],
      [expand.tool, { values: [[1]] }],
      [counts.tool, { counts: [{ value: {}, count: 1 }] }],
    ];
    for (const [tool, result] of invalid)
      expect(
        matchesToolJsonSchema({ result }, tool.outputSchema),
        tool.id,
      ).toBe(false);
  });

  it("rejects wrong containers, tags, required details and metadata types", () => {
    const invalid: readonly [ToolContract, unknown][] = [
      [ini.tool, { lines: [{ index: 0, kind: "section" }] }],
      [ini.tool, { lines: [{ index: 0, kind: "assignment", value: "x" }] }],
      [ini.tool, { lines: [{ index: 0, kind: "blank", value: "x" }] }],
      [ini.tool, { lines: [{ index: 0, kind: "unknown" }] }],
      [defaults.tool, { object: [], filledKeys: [] }],
      [prefix.tool, { matching: {}, other: null }],
      [rename.tool, { object: "{}" }],
      [prune.tool, { object: {}, removedKeys: [false] }],
      [pointer.tool, { hasParent: false, parent: false, finalToken: null }],
      [coalesce.tool, { records: [null] }],
      [project.tool, { records: [[]] }],
      [lookup.tool, { found: true, recordIndex: -1, record: {} }],
      [antiJoin.tool, { records: [{}], sourceIndexes: [0.5] }],
      [sort.tool, { records: {}, sourceIndexes: [] }],
      [
        log.tool,
        {
          counts: [{ level: null, aliasCycle: false, count: 1, indexes: [0] }],
        },
      ],
      [cnf.tool, { clauseCount: 1.5, literalCount: 1, distributionEvents: 0 }],
      [
        trie.tool,
        { nodes: [{ id: 0, parent: "root", character: "", terminal: false }] },
      ],
    ];
    for (const [tool, result] of invalid)
      expect(
        matchesToolJsonSchema({ result }, tool.outputSchema),
        tool.id,
      ).toBe(false);
  });

  it("rejects nonportable leaves even inside intentionally open JSON records", () => {
    let calls = 0;
    const getter = {
      get secret() {
        calls++;
        throw new Error("Do not invoke accessors");
      },
    };
    for (const value of [
      undefined,
      Infinity,
      NaN,
      new Date(),
      Array(1),
      getter,
    ]) {
      expect(
        matchesToolJsonSchema(
          { result: { object: { value }, filledKeys: [] } },
          defaults.tool.outputSchema,
        ),
      ).toBe(false);
    }
    expect(calls).toBe(0);
  });
});
