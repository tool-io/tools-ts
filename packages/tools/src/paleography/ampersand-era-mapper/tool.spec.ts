import { describe, expect, it } from "vitest";
import { ampersandEraMapperExample, runAmpersandEraMapper } from "./tool.js";

describe("ampersand-era-mapper", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runAmpersandEraMapper(ampersandEraMapperExample.input)).toEqual({
      ok: true,
      output: ampersandEraMapperExample.output,
    });
  });

  it("flags a classical ligature in a Gothic century as implausible", () => {
    const result = runAmpersandEraMapper({
      century: 14,
      style: "classical_ligature",
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.plausibleForCentury as boolean).toBe(false);
    expect(result.output.expectedStyles as string).toBe("gothic_compressed");
  });

  it("rejects non-positive centuries", () => {
    expect(
      runAmpersandEraMapper({ century: 0, style: "humanist_roman" }).ok,
    ).toBe(false);
  });
});
