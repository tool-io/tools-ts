import { describe, expect, it } from "vitest";
import { runTriproticPh } from "./tool.js";

describe("Triprotic Amphiprotic Species pH Estimate", () => {
  it("calculates a valid result", () => {
    expect(
      runTriproticPh({ pka1: 2, pka2: 7, pka3: 12, species: "H2A-" }),
    ).toEqual({ ok: true, output: { ph: 4.5 } });
  });
  it("rejects invalid input", () =>
    expect(runTriproticPh(null).ok).toBe(false));
});
