import { describe, expect, it } from "vitest";
import {
  runSandpaperGritSequence,
  sandpaperGritSequenceExample,
} from "./tool.js";

describe("Sandpaper Grit Sequence Lookup", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runSandpaperGritSequence(sandpaperGritSequenceExample.input),
    ).toEqual({
      ok: true,
      output: sandpaperGritSequenceExample.output,
    }));

  it("returns three successors from the lowest FEPA grit", () =>
    expect(runSandpaperGritSequence({ startGrit: 60 })).toEqual({
      ok: true,
      output: { nextGrits: [80, 100, 120] },
    }));

  it("returns only two grits near the end of the sequence", () =>
    expect(runSandpaperGritSequence({ startGrit: 800 })).toEqual({
      ok: true,
      output: { nextGrits: [1000, 1200] },
    }));

  it("returns a single grit for the second-to-last entry", () =>
    expect(runSandpaperGritSequence({ startGrit: 1000 })).toEqual({
      ok: true,
      output: { nextGrits: [1200] },
    }));

  it("returns an empty list at the maximum grit", () =>
    expect(runSandpaperGritSequence({ startGrit: 1200 })).toEqual({
      ok: true,
      output: { nextGrits: [] },
    }));

  it("skips non-uniform gaps in the middle of the sequence", () =>
    expect(runSandpaperGritSequence({ startGrit: 400 })).toEqual({
      ok: true,
      output: { nextGrits: [500, 600, 800] },
    }));

  it("accepts every grit of the FEPA sequence", () => {
    for (const startGrit of [
      60, 80, 100, 120, 150, 180, 220, 280, 320, 400, 500, 600, 800, 1000, 1200,
    ]) {
      const result = runSandpaperGritSequence({ startGrit });
      if (!result.ok) expect.fail(`expected success for grit ${startGrit}`);
      const expectedLength = Math.min(3, 14 - fepaIndexOf(startGrit));
      expect(result.output.nextGrits).toHaveLength(expectedLength);
    }
  });

  it("rejects an unlisted grit with unknown_grit", () => {
    const result = runSandpaperGritSequence({ startGrit: 250 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_grit");
  });

  it("rejects an out-of-sequence low grit", () => {
    const result = runSandpaperGritSequence({ startGrit: 59 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_grit");
  });

  it("rejects fractional grit values", () => {
    const result = runSandpaperGritSequence({ startGrit: 120.5 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects a missing start grit", () => {
    const result = runSandpaperGritSequence({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects unknown input fields", () =>
    expect(
      runSandpaperGritSequence({ startGrit: 120, extra: 1 } as never).ok,
    ).toBe(false));
});

function fepaIndexOf(startGrit: number): number {
  return [
    60, 80, 100, 120, 150, 180, 220, 280, 320, 400, 500, 600, 800, 1000, 1200,
  ].indexOf(startGrit);
}
