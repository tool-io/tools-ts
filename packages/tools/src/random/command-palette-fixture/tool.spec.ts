import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateCommandPaletteFixture,
  runCommandPaletteFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateCommandPaletteFixture, example);
    expect(runCommandPaletteFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(
      tool.execute({
        ...example.input,
        commands: [example.input.commands[0], example.input.commands[0]],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "commands", code: "duplicate_entries" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    const result = tool.execute(example.input);
    if (!result.ok) throw new Error("Expected palette");
    expect(result.output.searches[0]?.matchedIds).toHaveLength(2);
    expect(result.output.searches[1]?.matchedIds).toEqual([]);
    expect(
      result.output.commands.filter((c) => !c.available).map((c) => c.id),
    ).toEqual(["close"]);
  });
});
