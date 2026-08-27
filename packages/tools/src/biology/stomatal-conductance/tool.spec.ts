import { describe, expect, it } from "vitest";
import { stomatalConductanceExample, runStomatalConductance } from "./tool.js";

describe("Stomatal Conductance Estimate", () => {
  it("matches the canonical example", () => {
    expect(runStomatalConductance(stomatalConductanceExample.input)).toEqual({
      ok: true,
      output: stomatalConductanceExample.output,
    });
  });

  it("reports closed stomata without transpiration", () => {
    expect(
      runStomatalConductance({ transpirationMmolM2S: 0, vpdKpa: 1.5 }),
    ).toEqual({ ok: true, output: { stomatalConductance: 0 } });
  });

  it("reduces conductance under a large deficit", () => {
    expect(
      runStomatalConductance({ transpirationMmolM2S: 4, vpdKpa: 4 }),
    ).toEqual({ ok: true, output: { stomatalConductance: 1 } });
  });

  it("increases conductance in humid air", () => {
    expect(
      runStomatalConductance({ transpirationMmolM2S: 3.3, vpdKpa: 0.5 }),
    ).toEqual({ ok: true, output: { stomatalConductance: 6.6 } });
  });

  it("rejects a zero deficit with a stable field", () => {
    const result = runStomatalConductance({
      transpirationMmolM2S: 5,
      vpdKpa: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_value",
        field: "vpdKpa",
      });
  });

  it("rejects negative transpiration through the schema", () => {
    expect(
      runStomatalConductance({ transpirationMmolM2S: -1, vpdKpa: 2 }).ok,
    ).toBe(false);
  });

  it("rejects negative and non finite deficits through the schema and guard", () => {
    expect(
      runStomatalConductance({ transpirationMmolM2S: 5, vpdKpa: -2 }).ok,
    ).toBe(false);
    expect(
      runStomatalConductance({
        transpirationMmolM2S: 5,
        vpdKpa: Number.NaN,
      }).ok,
    ).toBe(false);
  });
});
