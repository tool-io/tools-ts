import { describe, expect, it } from "vitest";
import { bunCreatinineRatioExample, runBunCreatinineRatio } from "./tool.js";

describe("BUN Creatinine Ratio", () => {
  it("matches the canonical example", () => {
    expect(runBunCreatinineRatio(bunCreatinineRatioExample.input)).toEqual({
      ok: true,
      output: bunCreatinineRatioExample.output,
    });
  });

  it("reduces to the same ratio for scaled values", () => {
    expect(runBunCreatinineRatio({ bunMgDl: 28, creatinineMgDl: 2 })).toEqual({
      ok: true,
      output: { bunCreatinineRatio: 14 },
    });
  });

  it("computes a high ratio exactly", () => {
    expect(
      runBunCreatinineRatio({ bunMgDl: 100, creatinineMgDl: 0.5 }),
    ).toEqual({ ok: true, output: { bunCreatinineRatio: 200 } });
  });

  it("allows a zero BUN", () => {
    expect(runBunCreatinineRatio({ bunMgDl: 0, creatinineMgDl: 2 })).toEqual({
      ok: true,
      output: { bunCreatinineRatio: 0 },
    });
  });

  it("rejects zero creatinine through the schema", () => {
    const result = runBunCreatinineRatio({ bunMgDl: 14, creatinineMgDl: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "creatinineMgDl",
      });
  });

  it("rejects negative inputs through the schema", () => {
    expect(runBunCreatinineRatio({ bunMgDl: -1, creatinineMgDl: 1 }).ok).toBe(
      false,
    );
    expect(
      runBunCreatinineRatio({ bunMgDl: 14, creatinineMgDl: -0.5 }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields and missing required input", () => {
    const extra = runBunCreatinineRatio({
      bunMgDl: 14,
      creatinineMgDl: 1,
      glucoseMgDl: 90,
    });
    if (!extra.ok)
      expect(extra.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "glucoseMgDl",
      });
    expect(runBunCreatinineRatio({ bunMgDl: 14 }).ok).toBe(false);
  });
});
