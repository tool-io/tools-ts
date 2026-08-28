import { describe, expect, it } from "vitest";
import {
  runSmdResistorCodeDecode,
  smdResistorCodeDecodeExample,
} from "./tool.js";

describe("SMD Resistor Code", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSmdResistorCodeDecode(smdResistorCodeDecodeExample.input),
    ).toEqual({
      ok: true,
      output: smdResistorCodeDecodeExample.output,
    });
  });

  it("decodes 103 to ten kiloohms", () => {
    expect(runSmdResistorCodeDecode({ code: "103" })).toEqual({
      ok: true,
      output: { resistanceOhms: 10000 },
    });
  });

  it("decodes a zero multiplier as no scaling", () => {
    expect(runSmdResistorCodeDecode({ code: "100" })).toEqual({
      ok: true,
      output: { resistanceOhms: 10 },
    });
  });

  it("decodes the largest three-digit code", () => {
    expect(runSmdResistorCodeDecode({ code: "999" })).toEqual({
      ok: true,
      output: { resistanceOhms: 99000000000 },
    });
  });

  it("rejects non-numeric codes with invalid_code", () => {
    expect(runSmdResistorCodeDecode({ code: "47a" })).toMatchObject({
      error: { issues: [{ code: "invalid_code", field: "code" }] },
      ok: false,
    });
  });

  it("rejects codes that are too short or too long", () => {
    expect(runSmdResistorCodeDecode({ code: "47" }).ok).toBe(false);
    expect(runSmdResistorCodeDecode({ code: "1234" }).ok).toBe(false);
  });

  it("rejects missing codes", () => {
    expect(runSmdResistorCodeDecode({}).ok).toBe(false);
  });
});
