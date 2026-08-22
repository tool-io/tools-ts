import { describe, expect, it } from "vitest";
import { runWingLoading } from "./tool.js";

describe("wing loading calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runWingLoading({ weightLb: 2000, wingAreaFt2: 150 })).toEqual({
      ok: true,
      output: { wingLoadingPsf: 2000 / 150 },
    });
  });

  it("rejects zero wing area through execution", () => {
    expect(runWingLoading({ weightLb: 2000, wingAreaFt2: 0 })).toMatchObject({
      error: { issues: [{ code: "invalid_area" }] },
      ok: false,
    });
  });
});
