import { describe, expect, it } from "vitest";
import { calculateBootstrapStandardError } from "./tool.js";

describe("bootstrap standard error", () => {
  it("returns zero for a constant sample", () => {
    expect(
      calculateBootstrapStandardError({ resamples: 100, values: [4, 4, 4] }),
    ).toMatchObject({ ok: true, output: { estimate: 4, standardError: 0 } });
  });

  it("is deterministic for an explicit seed", () => {
    const input = { resamples: 200, seed: 42, values: [1, 2, 4, 8] };
    expect(calculateBootstrapStandardError(input)).toEqual(
      calculateBootstrapStandardError(input),
    );
  });

  it("rejects too few resamples", () => {
    expect(
      calculateBootstrapStandardError({ resamples: 1, values: [1, 2] }),
    ).toMatchObject({ error: { code: "invalid_input" }, ok: false });
  });
});
