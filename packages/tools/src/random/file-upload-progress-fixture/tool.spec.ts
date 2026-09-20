import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateFileUploadProgressFixture,
  runFileUploadProgressFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateFileUploadProgressFixture, example);
    expect(runFileUploadProgressFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(
      tool.execute({ ...example.input, maximumIncrement: 101 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "maximumIncrement", code: "invalid_field" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    const draws = [0, 0, 0, 0, 0, 0, 0.99, 0.99];
    const { seed, ...input } = example.input;
    const result = tool.execute(
      { ...input, eventCount: 4, maximumIncrement: 100 },
      { random: () => draws.shift() ?? 0 },
    );
    if (!result.ok) throw new Error("Expected trace");
    expect(result.output.events.map((e) => e.action)).toEqual([
      "start",
      "fail",
      "retry",
      "advance",
    ]);
    expect(result.output.final[0]).toMatchObject({
      progress: 100,
      status: "complete",
    });
    expect(result.output.initial[0]).toMatchObject({
      progress: 0,
      status: "queued",
    });
  });
});
