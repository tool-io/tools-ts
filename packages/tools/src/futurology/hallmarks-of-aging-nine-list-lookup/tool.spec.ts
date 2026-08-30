import { describe, expect, it } from "vitest";
import {
  hallmarkLookupExample,
  lookupHallmarkOfAging,
  runHallmarkLookup,
} from "./tool.js";

describe("hallmarks of aging nine lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runHallmarkLookup(hallmarkLookupExample.input)).toEqual({
      ok: true,
      output: hallmarkLookupExample.output,
    });
  });

  it("looks up hallmark one", () => {
    expect(lookupHallmarkOfAging({ hallmarkNumber: 1 }).hallmarkName).toBe(
      "Genomic instability",
    );
  });

  it("looks up hallmark nine", () => {
    expect(lookupHallmarkOfAging({ hallmarkNumber: 9 }).system).toBe(
      "intercellular signaling",
    );
  });

  it("rejects a hallmark number above nine", () => {
    expect(runHallmarkLookup({ hallmarkNumber: 10 })).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "hallmarkNumber" }],
      },
      ok: false,
    });
  });
});
