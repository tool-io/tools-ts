import { describe, expect, it } from "vitest";
import {
  abvSimpleSgDropExample,
  abvSimpleSgDropTool,
  runAbvSimpleSgDrop,
} from "./tool.js";

describe("abvSimpleSgDropTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runAbvSimpleSgDrop(abvSimpleSgDropExample.input)).toEqual({
      ok: true,
      output: abvSimpleSgDropExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(abvSimpleSgDropExample))).toEqual(
      abvSimpleSgDropExample,
    );
    expect(abvSimpleSgDropTool.contractVersion).toBe(1);
    expect(abvSimpleSgDropTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runAbvSimpleSgDrop(null).ok).toBe(false);
    expect(
      runAbvSimpleSgDrop({
        ...abvSimpleSgDropExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });

  it("uses the 131.25 specific-gravity approximation", () => {
    expect(runAbvSimpleSgDrop({ gravityDrop: 0.08 })).toEqual({
      ok: true,
      output: { alcoholByVolumePercent: 10.5 },
    });
  });
});
