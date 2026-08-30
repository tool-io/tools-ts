import { describe, expect, it } from "vitest";
import {
  neoVintageBoundaryExample,
  runNeoVintageBoundary,
  screenNeoVintageYear,
} from "./tool.js";

describe("neo-vintage year-boundary screen", () => {
  it("reproduces the canonical 1990 within-window example", () => {
    expect(runNeoVintageBoundary(neoVintageBoundaryExample.input)).toEqual({
      ok: true,
      output: neoVintageBoundaryExample.output,
    });
  });

  it("includes both caller boundaries", () => {
    expect(
      screenNeoVintageYear({
        earliestYear: 1980,
        latestYear: 2000,
        productionYear: 1980,
      }).classification,
    ).toBe("withinWindow");
  });

  it("classifies a year before the window", () => {
    expect(
      screenNeoVintageYear({
        earliestYear: 1980,
        latestYear: 2000,
        productionYear: 1979,
      }).classification,
    ).toBe("beforeWindow");
  });

  it("rejects a reversed year window", () => {
    expect(
      runNeoVintageBoundary({
        earliestYear: 2000,
        latestYear: 1980,
        productionYear: 1990,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "year_window_reversed", field: "" }] },
      ok: false,
    });
  });

  it("rejects a noninteger production year", () => {
    expect(
      runNeoVintageBoundary({
        earliestYear: 1980,
        latestYear: 2000,
        productionYear: 1990.5,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "productionYear" }],
      },
      ok: false,
    });
  });
});
