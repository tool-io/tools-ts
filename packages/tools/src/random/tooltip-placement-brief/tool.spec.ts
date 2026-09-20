import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateTooltipPlacementBrief,
  runTooltipPlacementBrief,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateTooltipPlacementBrief, example);
    expect(runTooltipPlacementBrief(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(
      tool.execute({
        ...example.input,
        rectangles: [{ x: 1e308, y: 0, width: 1e308, height: 2 }],
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "rectangles", code: "nonfinite_arithmetic" }],
      },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    expect(tool.execute({ ...example.input, sides: ["right"] })).toMatchObject({
      ok: true,
      output: { briefs: [{ anchor: { x: 8, y: 8 } }] },
    });
    expect(tool.execute({ ...example.input, sides: ["bottom"] })).toMatchObject(
      { ok: true, output: { briefs: [{ anchor: { x: 5, y: 12 } }] } },
    );
  });
});
