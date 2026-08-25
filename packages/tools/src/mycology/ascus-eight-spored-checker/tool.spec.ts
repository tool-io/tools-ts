import { describe, expect, it } from "vitest";
import {
  ascusEightSporedCheckerExample,
  ascusEightSporedCheckerTool,
  runAscusEightSporedChecker,
} from "./tool.js";

describe("ascusEightSporedCheckerTool", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runAscusEightSporedChecker(ascusEightSporedCheckerExample.input),
    ).toEqual({
      ok: true,
      output: ascusEightSporedCheckerExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(ascusEightSporedCheckerExample))).toEqual(
      ascusEightSporedCheckerExample,
    );
    expect(ascusEightSporedCheckerTool.contractVersion).toBe(1);
    expect(ascusEightSporedCheckerTool.execution).toEqual({ kind: "pure" });
  });

  it("flags exactly eight spores", () => {
    const r = runAscusEightSporedChecker({ sporesPerAscus: 8 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.isEightSpored).toBe(true);
  });

  it("does not flag neighbouring counts", () => {
    expect(runAscusEightSporedChecker({ sporesPerAscus: 7 }).ok).toBe(true);
    const r = runAscusEightSporedChecker({ sporesPerAscus: 7 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.isEightSpored).toBe(false);
    expect(r.output.sporesPerAscus).toBe(7);
    expect(runAscusEightSporedChecker({ sporesPerAscus: 16 }).ok).toBe(true);
  });

  it("accepts positive whole-number observations", () => {
    const low = runAscusEightSporedChecker({ sporesPerAscus: 1 });
    const high = runAscusEightSporedChecker({ sporesPerAscus: 16 });
    if (!low.ok || !high.ok) throw new Error("expected success");
    expect(low.output.isEightSpored).toBe(false);
    expect(high.output.isEightSpored).toBe(false);
  });

  it("rejects counts below one", () => {
    expect(runAscusEightSporedChecker({ sporesPerAscus: 0 }).ok).toBe(false);
    expect(runAscusEightSporedChecker({ sporesPerAscus: -3 }).ok).toBe(false);
  });

  it("does not impose an arbitrary sixteen-spore ceiling", () => {
    const result = runAscusEightSporedChecker({ sporesPerAscus: 17 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.isEightSpored).toBe(false);
  });

  it("rejects non-integer and malformed input", () => {
    expect(runAscusEightSporedChecker({ sporesPerAscus: 7.5 }).ok).toBe(false);
    expect(runAscusEightSporedChecker(null).ok).toBe(false);
    expect(
      runAscusEightSporedChecker({
        ...ascusEightSporedCheckerExample.input,
        extra: 1,
      }).ok,
    ).toBe(false);
  });
});
