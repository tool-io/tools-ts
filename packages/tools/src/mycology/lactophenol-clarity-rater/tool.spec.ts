import { describe, expect, it } from "vitest";
import {
  lactophenolClarityRaterExample,
  runLactophenolClarityRater,
} from "./tool.js";

describe("Clarity Rater", () => {
  it("matches the canonical example", () =>
    expect(
      runLactophenolClarityRater(lactophenolClarityRaterExample.input),
    ).toEqual({
      ok: true,
      output: lactophenolClarityRaterExample.output,
    }));
  it("records clear mounts", () =>
    expect(runLactophenolClarityRater({ clarity: "clear" })).toEqual({
      ok: true,
      output: { clarity: "clear" },
    }));
  it("records partially refractile mounts", () =>
    expect(
      runLactophenolClarityRater({ clarity: "partially-refractile" }),
    ).toEqual({
      ok: true,
      output: { clarity: "partially-refractile" },
    }));
  it("records refractile mounts", () =>
    expect(runLactophenolClarityRater({ clarity: "refractile" })).toEqual({
      ok: true,
      output: { clarity: "refractile" },
    }));
  it("accepts every supported observation without inventing a score", () => {
    for (const clarity of ["clear", "partially-refractile", "refractile"]) {
      const result = runLactophenolClarityRater({ clarity });
      expect(result).toEqual({
        ok: true,
        output: { clarity },
      });
    }
  });
  it("echoes the clarity label beside the rating", () => {
    const result = runLactophenolClarityRater({ clarity: "clear" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.clarity).toBe("clear");
  });
  it("rejects clarity outside the enum", () =>
    expect(runLactophenolClarityRater({ clarity: "opaque" }).ok).toBe(false));
});
