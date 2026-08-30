import { describe, expect, it } from "vitest";
import {
  calculateMusTaintingFactor,
  musTaintingFactorExample,
  runMusTaintingFactor,
} from "./tool.js";

describe("MUS tainting-factor projected misstatement", () => {
  it("reproduces its canonical example", () => {
    expect(runMusTaintingFactor(musTaintingFactorExample.input)).toEqual({
      ok: true,
      output: musTaintingFactorExample.output,
    });
  });

  it("uses actual misstatement for an individually significant item", () => {
    expect(
      calculateMusTaintingFactor({
        auditedValue: 90,
        bookValue: 100,
        individuallySignificant: true,
        samplingInterval: 1_000,
      }),
    ).toMatchObject({
      misstatement: 10,
      projectedMisstatement: 10,
      projectionMethod: "actual",
      taintingFactor: 0.1,
    });
  });

  it("retains the sign of an understatement", () => {
    expect(
      calculateMusTaintingFactor({
        auditedValue: 110,
        bookValue: 100,
        individuallySignificant: false,
        samplingInterval: 1_000,
      }).projectedMisstatement,
    ).toBe(-100);
  });

  it("rejects a zero book value", () => {
    expect(
      runMusTaintingFactor({
        auditedValue: 0,
        bookValue: 0,
        individuallySignificant: false,
        samplingInterval: 100,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "zero_book_value", field: "bookValue" }] },
      ok: false,
    });
  });
});
