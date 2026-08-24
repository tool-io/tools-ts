import { describe, expect, it } from "vitest";
import {
  easterTableEntryDecoderExample,
  runEasterTableEntryDecoder,
} from "./tool.js";

describe("easter-table-entry-decoder", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runEasterTableEntryDecoder(easterTableEntryDecoderExample.input),
    ).toEqual({ ok: true, output: easterTableEntryDecoderExample.output });
  });

  it("decodes Julian 1054 as golden 10, 3 April (Julian)", () => {
    expect(
      runEasterTableEntryDecoder({ year: 1054, calendar: "julian" }),
    ).toEqual({
      ok: true,
      output: { goldenNumber: 10, easterMonth: 4, easterDay: 3 },
    });
  });

  it("rejects years before Nicaea", () => {
    expect(runEasterTableEntryDecoder({ year: 324 }).ok).toBe(false);
  });
});
