import { describe, expect, it } from "vitest";
import {
  calculateWantlistCompletionProgressPercent,
  example,
  runWantlistCompletionProgressPercent,
} from "./tool.js";

describe("numismatics/wantlist-completion-progress-percent", () => {
  it("calculates the published example", () => {
    expect(calculateWantlistCompletionProgressPercent(example.input)).toEqual(
      example.output,
    );
    expect(runWantlistCompletionProgressPercent(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runWantlistCompletionProgressPercent({
      ...example.input,
      acquiredItems: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runWantlistCompletionProgressPercent({
        ...example.input,
        targetItems: 0,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "targetItems" }] },
    });
  });
});
