import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateTreeViewExpansionFixture,
  runTreeViewExpansionFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateTreeViewExpansionFixture, example);
    expect(runTreeViewExpansionFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(tool.execute({ ...example.input, nodeCount: 33 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "nodeCount", code: "invalid_field" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    const { seed, ...input } = example.input;
    const result = tool.execute(input, { random: () => 0.9 });
    if (!result.ok) throw new Error("Expected tree");
    expect(result.output.nodes.map((n) => n.visible)).toEqual([true, false]);
    expect(result.output.nodes.filter((n) => n.selected)).toHaveLength(1);
    expect(new Set(result.output.nodes.map((n) => n.id)).size).toBe(2);
  });
});
