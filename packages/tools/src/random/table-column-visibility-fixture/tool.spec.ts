import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateTableColumnVisibilityFixture,
  runTableColumnVisibilityFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateTableColumnVisibilityFixture, example);
    expect(runTableColumnVisibilityFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(
      tool.execute({
        ...example.input,
        columns: [example.input.columns[0], example.input.columns[0]],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "columns", code: "duplicate_entries" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    const { seed, ...input } = example.input;
    const result = tool.execute(input, { random: () => 0.99 });
    if (!result.ok) throw new Error("Expected columns");
    expect(result.output.visibleOrder).toEqual(["name"]);
    expect(result.output.columns.find((c) => c.required)?.visible).toBe(true);
  });
});
