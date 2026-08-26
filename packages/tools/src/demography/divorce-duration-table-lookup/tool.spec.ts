import { describe, expect, it } from "vitest";
import {
  divorceDurationTableLookupExample,
  runDivorceDurationTableLookup,
} from "./tool.js";

describe("divorce-duration-table-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDivorceDurationTableLookup(divorceDurationTableLookupExample.input),
    ).toEqual({
      ok: true,
      output: divorceDurationTableLookupExample.output,
    });
  });

  it("keeps the first modal year when counts tie", () => {
    const r = runDivorceDurationTableLookup({
      divorcesByDurationYear: [5, 9, 9, 2],
      queryDurationYear: 3,
    });
    expect(r.ok && r.output.modalDurationYear).toBe(1);
    expect(r.ok && r.output.percentOfAllDivorces).toBe(8);
  });

  it("rejects out-of-range duration queries", () => {
    expect(
      runDivorceDurationTableLookup({
        divorcesByDurationYear: [1, 2],
        queryDurationYear: 7,
      }).ok,
    ).toBe(false);
  });
});
