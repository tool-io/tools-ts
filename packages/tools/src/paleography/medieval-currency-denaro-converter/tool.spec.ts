import { describe, expect, it } from "vitest";
import {
  medievalCurrencyDenaroConverterExample,
  runMedievalCurrencyDenaroConverter,
} from "./tool.js";

describe("medieval-currency-denaro-converter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMedievalCurrencyDenaroConverter(
        medievalCurrencyDenaroConverterExample.input,
      ),
    ).toEqual({
      ok: true,
      output: medievalCurrencyDenaroConverterExample.output,
    });
  });

  it("expresses one and a quarter lire in full lsd form", () => {
    expect(
      runMedievalCurrencyDenaroConverter({ amount: 1.25, unit: "lira" }),
    ).toEqual({
      ok: true,
      output: { totalDenari: 300, totalSolidi: 25, lsdNotation: "1lb 5s" },
    });
  });

  it("converts zero and rejects negative amounts", () => {
    expect(
      runMedievalCurrencyDenaroConverter({ amount: 0, unit: "denaro" }),
    ).toEqual({
      ok: true,
      output: { totalDenari: 0, totalSolidi: 0, lsdNotation: "0d" },
    });
    expect(
      runMedievalCurrencyDenaroConverter({ amount: -1, unit: "denaro" }).ok,
    ).toBe(false);
  });
});
