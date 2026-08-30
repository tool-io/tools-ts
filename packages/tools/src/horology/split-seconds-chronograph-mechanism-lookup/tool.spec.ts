import { describe, expect, it } from "vitest";
import {
  lookupSplitSecondsMechanism,
  rattrapanteExample,
  runRattrapante,
} from "./tool.js";

describe("split-seconds chronograph mechanism lookup", () => {
  it("reproduces the canonical resynchronization statement", () => {
    expect(runRattrapante(rattrapanteExample.input)).toEqual({
      ok: true,
      output: rattrapanteExample.output,
    });
  });

  it("describes comparative lap-time use", () => {
    expect(
      lookupSplitSecondsMechanism({ mechanismFocus: "useCase" })
        .verifiedStatement,
    ).toContain("intermediate event times");
  });

  it("describes independent stopping", () => {
    expect(
      lookupSplitSecondsMechanism({ mechanismFocus: "startAndStop" })
        .verifiedStatement,
    ).toContain("stops the split hand");
  });

  it("covers the documented Patek Philippe history", () => {
    expect(
      lookupSplitSecondsMechanism({ mechanismFocus: "history" }).keyDate,
    ).toBe("1923");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runRattrapante({ mechanismFocus: "flyback" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "mechanismFocus" }] },
      ok: false,
    });
  });
});
