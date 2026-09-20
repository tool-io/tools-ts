import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateTimelineCardContentFixture,
  runTimelineCardContentFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateTimelineCardContentFixture, example);
    expect(runTimelineCardContentFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(tool.execute({ ...example.input, minimumGap: 3 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "maximumGap", code: "invalid_gap_range" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    const { seed, ...input } = example.input;
    expect(
      tool.execute(
        { ...input, count: 2, minimumGap: 0, maximumGap: 0 },
        { random: () => 0 },
      ),
    ).toMatchObject({
      ok: true,
      output: {
        cards: [
          { tick: 0, body: "Body" },
          { tick: 0, body: "Body" },
        ],
        inversionIndices: [],
      },
    });
  });
});
