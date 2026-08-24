import { describe, expect, it } from "vitest";
import {
  byzantineAnnomundiConverterExample,
  runByzantineAnnomundiConverter,
} from "./tool.js";

describe("byzantine-annomundi-converter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runByzantineAnnomundiConverter(byzantineAnnomundiConverterExample.input),
    ).toEqual({ ok: true, output: byzantineAnnomundiConverterExample.output });
  });

  it("assigns a September date to the next Anno Mundi year", () => {
    expect(runByzantineAnnomundiConverter({ adYear: 1453, month: 10 })).toEqual(
      {
        ok: true,
        output: {
          annoMundi: 6962,
          indiction: 7,
          byzantineYearSpan: "1453-09-01 to 1454-08-31",
        },
      },
    );
  });

  it("rejects months outside 1-12", () => {
    expect(runByzantineAnnomundiConverter({ adYear: 1453, month: 13 }).ok).toBe(
      false,
    );
  });
});
