import { describe, expect, it } from "vitest";
import {
  filterRoundDollarEntries,
  roundDollarEntryExample,
  runRoundDollarEntry,
} from "./tool.js";

describe("round dollar manual adjustment entry filter", () => {
  it("reproduces its canonical example", () => {
    expect(runRoundDollarEntry(roundDollarEntryExample.input)).toEqual({
      ok: true,
      output: roundDollarEntryExample.output,
    });
  });

  it("matches negative multiples and keeps their sign in the total", () => {
    expect(
      filterRoundDollarEntries({
        entries: [{ amount: -200 }, { amount: -199 }],
        increment: 100,
      }),
    ).toEqual({
      matchedCount: 1,
      matchedIndices: [0],
      matchedTotal: -200,
    });
  });

  it("treats zero as a round amount", () => {
    expect(
      filterRoundDollarEntries({
        entries: [{ amount: 0 }],
        increment: 100,
      }),
    ).toEqual({ matchedCount: 1, matchedIndices: [0], matchedTotal: 0 });
  });

  it("supports fractional increments", () => {
    expect(
      filterRoundDollarEntries({
        entries: [{ amount: 1.5 }, { amount: 1.25 }, { amount: 3 }],
        increment: 0.5,
      }).matchedIndices,
    ).toEqual([0, 2]);
  });

  it("recognizes decimal multiples despite binary floating-point noise", () => {
    expect(
      filterRoundDollarEntries({
        entries: [{ amount: 0.3 }, { amount: 0.31 }],
        increment: 0.1,
      }).matchedIndices,
    ).toEqual([0]);
  });

  it("rejects a zero increment with a stable code", () => {
    expect(
      runRoundDollarEntry({ entries: [{ amount: 100 }], increment: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_increment", field: "increment" }] },
      ok: false,
    });
  });

  it("rejects a non-finite entry amount", () => {
    expect(
      runRoundDollarEntry({
        entries: [{ amount: Number.NaN }],
        increment: 100,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_entry_amount", field: "entries.0.amount" }],
      },
      ok: false,
    });
  });

  it("classifies large decimal amounts without a quotient tolerance", () => {
    expect(
      runRoundDollarEntry({
        entries: [{ amount: 1e16 }, { amount: 1e16 + 2 }],
        increment: 1,
      }),
    ).toMatchObject({
      ok: true,
      output: { matchedIndices: [0, 1], matchedCount: 2 },
    });
  });

  it("does not call a near-multiple exact at high magnitudes", () => {
    expect(
      filterRoundDollarEntries({
        entries: [{ amount: 100000000000000.05 }],
        increment: 1,
      }).matchedIndices,
    ).toEqual([]);
  });
});
