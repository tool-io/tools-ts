import { describe, expect, it } from "vitest";
import {
  aucChroniclerConverterExample,
  runAucChroniclerConverter,
} from "./tool.js";

describe("auc-chronicler-converter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runAucChroniclerConverter(aucChroniclerConverterExample.input),
    ).toEqual({ ok: true, output: aucChroniclerConverterExample.output });
  });

  it("maps AUC 754 across the epoch to AD 1 without a year zero", () => {
    expect(
      runAucChroniclerConverter({ direction: "auc_to_ad", year: 754 }),
    ).toEqual({
      ok: true,
      output: { convertedYear: 1, countingEra: "ad" },
    });
  });

  it("rejects BC years before the founding", () => {
    expect(
      runAucChroniclerConverter({ direction: "bc_to_auc", year: 800 }).ok,
    ).toBe(false);
  });
});
