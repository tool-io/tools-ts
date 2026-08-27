import { describe, expect, it } from "vitest";
import { runPrimerMeltingTempNearestNeighbor } from "./tool.js";

describe("Nearest Neighbor Tm Approx", () => {
  it("calculates a valid result with default salt", () =>
    expect(
      runPrimerMeltingTempNearestNeighbor({ sequence: "ATCGCGTA" }),
    ).toEqual({
      ok: true,
      output: { meltingTempC: 17.902902071977906 },
    }));
  it("lowers Tm at lower salt concentration", () =>
    expect(
      runPrimerMeltingTempNearestNeighbor({
        naConcentrationM: 0.01,
        sequence: "ATCGCGTA",
      }),
    ).toEqual({ ok: true, output: { meltingTempC: 6.299999999999997 } }));
  it("rewards GC-rich primers", () =>
    expect(runPrimerMeltingTempNearestNeighbor({ sequence: "GGCC" })).toEqual({
      ok: true,
      output: { meltingTempC: -24.097097928022094 },
    }));
  it("penalizes AT-only primers", () =>
    expect(runPrimerMeltingTempNearestNeighbor({ sequence: "ATAT" })).toEqual({
      ok: true,
      output: { meltingTempC: -65.0970979280221 },
    }));
  it("scales with primer length", () =>
    expect(
      runPrimerMeltingTempNearestNeighbor({
        sequence: "ACGTACGTACGTACGTACGT",
      }),
    ).toEqual({
      ok: true,
      output: { meltingTempC: 55.402902071977906 },
    }));
  it("rejects an empty sequence", () => {
    const result = runPrimerMeltingTempNearestNeighbor({ sequence: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("empty_sequence");
  });
  it("rejects non-DNA characters", () => {
    const result = runPrimerMeltingTempNearestNeighbor({ sequence: "ATGU" });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_sequence");
  });
  it("rejects lowercase sequences", () =>
    expect(runPrimerMeltingTempNearestNeighbor({ sequence: "atcg" }).ok).toBe(
      false,
    ));
  it("rejects non-positive salt concentrations", () => {
    const result = runPrimerMeltingTempNearestNeighbor({
      naConcentrationM: 0,
      sequence: "ATCG",
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_concentration");
  });
});
