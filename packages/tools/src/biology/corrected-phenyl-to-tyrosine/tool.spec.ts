import { describe, expect, it } from "vitest";
import { phenylToTyrosineExample, runPhenylToTyrosine } from "./tool.js";

describe("Phenyl Tyrosine Ratio", () => {
  it("matches the canonical example", () => {
    expect(runPhenylToTyrosine(phenylToTyrosineExample.input)).toEqual({
      ok: true,
      output: phenylToTyrosineExample.output,
    });
  });

  it("reports one for equal concentrations", () => {
    expect(
      runPhenylToTyrosine({ phenylalanineUmolL: 50, tyrosineUmolL: 50 }),
    ).toEqual({ ok: true, output: { phenylTyrosineRatio: 1 } });
  });

  it("computes a fractional ratio exactly", () => {
    expect(
      runPhenylToTyrosine({ phenylalanineUmolL: 33, tyrosineUmolL: 44 }),
    ).toEqual({ ok: true, output: { phenylTyrosineRatio: 0.75 } });
  });

  it("allows a zero phenylalanine", () => {
    expect(
      runPhenylToTyrosine({ phenylalanineUmolL: 0, tyrosineUmolL: 40 }),
    ).toEqual({ ok: true, output: { phenylTyrosineRatio: 0 } });
  });

  it("rejects zero tyrosine through the schema", () => {
    const result = runPhenylToTyrosine({
      phenylalanineUmolL: 60,
      tyrosineUmolL: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "tyrosineUmolL",
      });
  });

  it("rejects negative phenylalanine through the schema", () => {
    const result = runPhenylToTyrosine({
      phenylalanineUmolL: -60,
      tyrosineUmolL: 50,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects unknown fields and missing required input", () => {
    const extra = runPhenylToTyrosine({
      phenylalanineUmolL: 60,
      tyrosineUmolL: 50,
      glucoseMgDl: 90,
    });
    if (!extra.ok)
      expect(extra.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "glucoseMgDl",
      });
    expect(runPhenylToTyrosine({ tyrosineUmolL: 50 }).ok).toBe(false);
  });
});
