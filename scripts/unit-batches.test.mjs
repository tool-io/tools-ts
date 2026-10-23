import assert from "node:assert/strict";
import { test } from "node:test";
import { selectConformanceTools } from "../packages/tools/src/example-conformance-test-support.ts";

test("authored-example shards cover the full collection exactly once, including uneven boundaries", () => {
  for (const size of [1, 7, 31_500]) {
    const tools = Array.from({ length: size }, (_, index) => `tool-${index}`);
    const count = Math.min(32, size);
    const pieces = Array.from({ length: count }, (_, index) =>
      selectConformanceTools(tools, `${index + 1}/${count}`),
    );
    assert.deepEqual(
      pieces.flatMap((piece) => piece.tools),
      tools,
    );
    assert.ok(
      pieces.every((piece) => piece.tools.length <= Math.ceil(size / count)),
    );
    assert.deepEqual(selectConformanceTools(tools), { tools, start: 0 });
  }
  for (const shard of ["0/3", "4/3", "1/0", "1/4", "bad", "1/9007199254740992"])
    assert.throws(() => selectConformanceTools([1, 2, 3], shard));
});
