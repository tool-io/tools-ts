import { describe, expect, it } from "vitest";
import { runSystemsTractLookup, systemsTractLookupExample } from "./tool.js";

describe("systems-tract-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSystemsTractLookup(systemsTractLookupExample.input)).toEqual({
      ok: true,
      output: systemsTractLookupExample.output,
    });
  });

  it("bounds the transgressive tract by TS below and MFS above", () => {
    const result = runSystemsTractLookup({ systemsTract: "transgressive" });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.boundingSurfaces as string).toContain(
      "maximum flooding surface",
    );
  });

  it("rejects unknown tracts", () => {
    expect(runSystemsTractLookup({ systemsTract: "midstand" }).ok).toBe(false);
  });
});
