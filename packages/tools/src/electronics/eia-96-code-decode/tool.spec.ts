import { describe, expect, it } from "vitest";
import { eia96CodeDecodeExample, runEia96CodeDecode } from "./tool.js";

describe("EIA-96 Decode", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runEia96CodeDecode(eia96CodeDecodeExample.input)).toEqual({
      ok: true,
      output: eia96CodeDecodeExample.output,
    });
  });

  it("applies the S multiplier below one ohm", () => {
    expect(runEia96CodeDecode({ code: "01S" })).toEqual({
      ok: true,
      output: { resistanceOhms: 1 },
    });
  });

  it("applies the A multiplier for hundreds of ohms", () => {
    expect(runEia96CodeDecode({ code: "13A" })).toEqual({
      ok: true,
      output: { resistanceOhms: 13300 },
    });
  });

  it("applies the F multiplier at the top of the table", () => {
    expect(runEia96CodeDecode({ code: "96F" })).toEqual({
      ok: true,
      output: { resistanceOhms: 9760000000 },
    });
  });

  it("rejects digit codes beyond the table with invalid_code", () => {
    expect(runEia96CodeDecode({ code: "97B" })).toMatchObject({
      error: { issues: [{ code: "invalid_code", field: "code" }] },
      ok: false,
    });
  });

  it("rejects unknown multiplier letters with invalid_code", () => {
    expect(runEia96CodeDecode({ code: "24Z" })).toMatchObject({
      error: { issues: [{ code: "invalid_code", field: "code" }] },
      ok: false,
    });
  });

  it("rejects malformed codes with invalid_code", () => {
    expect(runEia96CodeDecode({ code: "2B" }).ok).toBe(false);
    expect(runEia96CodeDecode({ code: "AB2C" }).ok).toBe(false);
  });
});
