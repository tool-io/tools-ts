import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateNavigationMenuTree,
  runNavigationMenuTree,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateNavigationMenuTree, example);
    expect(runNavigationMenuTree(example.input)).toEqual({
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
    const result = tool.execute({ ...example.input, nodeCount: 4 });
    if (!result.ok) throw new Error("Expected tree");
    expect(result.output.nodes.filter((n) => n.current)).toHaveLength(1);
    for (const pathId of result.output.currentPath)
      expect(result.output.nodes.find((n) => n.id === pathId)?.disabled).toBe(
        false,
      );
    expect(new Set(result.output.nodes.map((n) => n.id)).size).toBe(4);
  });
});
