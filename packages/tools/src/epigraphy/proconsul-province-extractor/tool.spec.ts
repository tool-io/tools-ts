import { describe, expect, it } from "vitest";
import {
  calculateProconsulProvinceExtractor,
  proconsulProvinceExtractorExample,
  runProconsulProvinceExtractor,
} from "./tool.js";

describe("epigraphy/proconsul-province-extractor", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runProconsulProvinceExtractor(proconsulProvinceExtractorExample.input),
    ).toEqual({ ok: true, output: proconsulProvinceExtractorExample.output });
  });

  it("reads the abbreviated procos. form", () => {
    const result = calculateProconsulProvinceExtractor({
      text: "missus ad cognoscendum ad procos. Asiae",
    });
    expect(result.found).toBe(true);
    expect(result.province).toBe("Asiae");
    expect(
      calculateProconsulProvinceExtractor({ text: "PROCOS ASIAE" }).province,
    ).toBe("ASIAE");
  });

  it("reports not-found for non-proconsular phrases", () => {
    expect(
      calculateProconsulProvinceExtractor({
        text: "legatus Augusti pro praetore",
      }),
    ).toEqual({ found: false, province: "" });
  });

  it("rejects blank text", () => {
    expect(runProconsulProvinceExtractor({ text: "" }).ok).toBe(false);
  });
});
