import { describe, expect, it } from "vitest";
import { runPrimerConcentrationNm } from "./tool.js";

describe("Primer Concentration nM", () => {
  it("converts fifty nanograms per microlitre of a twenty-mer to molar concentration", () =>
    expect(
      runPrimerConcentrationNm({ concentrationNgUl: 50, lengthNt: 20 }),
    ).toEqual({
      ok: true,
      output: { primerConcentrationNm: 7575.757575757576 },
    }));
  it("converts twenty-five nanograms per microlitre of a twenty-five-mer", () =>
    expect(
      runPrimerConcentrationNm({ concentrationNgUl: 25, lengthNt: 25 }),
    ).toEqual({
      ok: true,
      output: { primerConcentrationNm: 3030.3030303030305 },
    }));
  it("converts thirty-three nanograms per microlitre of a sixty-mer", () =>
    expect(
      runPrimerConcentrationNm({ concentrationNgUl: 33, lengthNt: 60 }),
    ).toEqual({
      ok: true,
      output: { primerConcentrationNm: 1666.6666666666667 },
    }));
  it("doubles concentration with doubled mass at fixed length", () => {
    const single = runPrimerConcentrationNm({
      concentrationNgUl: 25,
      lengthNt: 30,
    });
    const doubled = runPrimerConcentrationNm({
      concentrationNgUl: 50,
      lengthNt: 30,
    });
    expect(single.ok && doubled.ok).toBe(true);
    if (single.ok && doubled.ok)
      expect(
        Number(doubled.output.primerConcentrationNm) /
          Number(single.output.primerConcentrationNm),
      ).toBeCloseTo(2, 12);
  });
  it("rejects zero mass concentration", () =>
    expect(
      runPrimerConcentrationNm({ concentrationNgUl: 0, lengthNt: 20 }).ok,
    ).toBe(false));
  it("rejects negative mass concentration", () =>
    expect(
      runPrimerConcentrationNm({ concentrationNgUl: -50, lengthNt: 20 }).ok,
    ).toBe(false));
  it("rejects zero length", () =>
    expect(
      runPrimerConcentrationNm({ concentrationNgUl: 50, lengthNt: 0 }).ok,
    ).toBe(false));
  it("rejects fractional lengths", () =>
    expect(
      runPrimerConcentrationNm({ concentrationNgUl: 50, lengthNt: 20.5 }).ok,
    ).toBe(false));
});
