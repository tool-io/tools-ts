import { describe, expect, it } from "vitest";
import { runJsonApplyPatch } from "../apply-patch/tool.js";
import {
  calculateJsonDiff,
  diffJson,
  jsonDiffExample,
  runJsonDiff,
} from "./tool.js";

describe("json/diff", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runJsonDiff(jsonDiffExample.input)).toEqual({
      ok: true,
      output: jsonDiffExample.output,
    });
  });

  it("emits an empty patch for identical documents", () => {
    expect(calculateJsonDiff({ a: '[1,{"x":2}]', b: '[1,{"x":2}]' })).toEqual({
      opCount: 0,
      patch: "[]",
    });
  });

  it("removes trailing array items in descending order before additions ascend", () => {
    const ops = diffJson([1, 2, 3, 4], [0, 9]);
    expect(ops).toEqual([
      { op: "remove", path: "/3" },
      { op: "remove", path: "/2" },
      { op: "replace", path: "/0", value: 0 },
      { op: "replace", path: "/1", value: 9 },
    ]);
  });

  it("replaces the whole value on type changes", () => {
    expect(diffJson({ a: 1 }, [42])).toEqual([
      { op: "replace", path: "", value: [42] },
    ]);
  });

  it("rejects malformed JSON with structured errors", () => {
    const result = runJsonDiff({ a: "{", b: "null" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.issues[0]?.code).toBe("malformed_json");
    expect(result.error.issues[0]?.field).toBe("a");
  });

  it("round-trips through the patch applier for varied shapes", () => {
    const pairs: readonly [string, string][] = [
      ['{"a":1,"b":{"c":[1,2,3]}}', '{"a":2,"b":{"c":[1]}}'],
      ["[true,null]", '{"t":[true,false],"u":"x"}'],
      ["42", '{"answer":42,"nested":{"deep":["a","b"]}}'],
      ['{"keep":0,"drop":1}', '{"keep":0,"extra":[7,8]}'],
      ['{"~special":"/path"}', '{"~special":"changed"}'],
      ["[1,[2,[3]]]", '[9,[8,[7,"six"]],"five"]'],
    ];
    for (const [a, b] of pairs) {
      const { patch } = calculateJsonDiff({ a, b });
      const applied = runJsonApplyPatch({ document: a, patch });
      expect(applied.ok).toBe(true);
      if (!applied.ok) continue;
      expect(JSON.parse(applied.output.result as string)).toEqual(
        JSON.parse(b),
      );
    }
  });
});
