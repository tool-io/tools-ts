import { describe, expect, it } from "vitest";
import {
  parquetExpansionGapExample,
  parquetExpansionGapTool,
  runParquetExpansionGap,
} from "./tool.js";

describe("Parquet Expansion Gap Rule", () => {
  it("computes the canonical example", () =>
    expect(runParquetExpansionGap(parquetExpansionGapExample.input)).toEqual({
      ok: true,
      output: { recommendedGapMm: 15 },
    }));

  it("recommends 10 mm below 10 m", () =>
    expect(runParquetExpansionGap({ roomLengthM: 9.99 })).toEqual({
      ok: true,
      output: { recommendedGapMm: 10 },
    }));

  it("recommends 15 mm from exactly 10 m", () =>
    expect(runParquetExpansionGap({ roomLengthM: 10 })).toEqual({
      ok: true,
      output: { recommendedGapMm: 15 },
    }));

  it.each([1, 5.5, 8])("keeps 10 mm for %p m rooms", (roomLengthM) =>
    expect(runParquetExpansionGap({ roomLengthM })).toEqual({
      ok: true,
      output: { recommendedGapMm: 10 },
    }),
  );

  it.each([12, 20, 30])("keeps 15 mm for %p m rooms", (roomLengthM) =>
    expect(runParquetExpansionGap({ roomLengthM })).toEqual({
      ok: true,
      output: { recommendedGapMm: 15 },
    }),
  );

  it("accepts the maximum room length of 30 m", () =>
    expect(runParquetExpansionGap({ roomLengthM: 30 }).ok).toBe(true));

  it("rejects room lengths above 30 m", () => {
    const result = runParquetExpansionGap({ roomLengthM: 30.01 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects non-positive room lengths", () => {
    const zero = runParquetExpansionGap({ roomLengthM: 0 });
    const negative = runParquetExpansionGap({ roomLengthM: -4 });
    expect(zero.ok).toBe(false);
    expect(negative.ok).toBe(false);
    if (!zero.ok) expect(zero.error.issues[0]?.code).toBe("must_be_positive");
  });

  it("rejects non-finite room lengths", () => {
    expect(runParquetExpansionGap({ roomLengthM: Number.NaN }).ok).toBe(false);
    expect(
      runParquetExpansionGap({ roomLengthM: Number.POSITIVE_INFINITY }).ok,
    ).toBe(false);
  });

  it("rejects a missing room length", () =>
    expect(runParquetExpansionGap({}).ok).toBe(false));

  it("rejects non-numeric room lengths", () =>
    expect(runParquetExpansionGap({ roomLengthM: "12" } as never).ok).toBe(
      false,
    ));

  it("rejects unknown input fields", () => {
    const result = runParquetExpansionGap({
      roomLengthM: 12,
      roomWidthM: 4,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(parquetExpansionGapExample))).toEqual(
      parquetExpansionGapExample,
    );
    expect(parquetExpansionGapTool.id).toBe(
      "carpentry/parkett-dehnungsfuge-10-15mm",
    );
    expect(parquetExpansionGapTool.execution).toEqual({ kind: "pure" });
    expect(parquetExpansionGapTool.outputSchema.required).toEqual([
      "recommendedGapMm",
    ]);
  });
});
