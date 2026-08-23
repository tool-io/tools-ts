import { describe, expect, it } from "vitest";
import { calculateJwt, jwtExample, runJwt } from "./tool.js";

describe("decode/jwt", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runJwt(jwtExample.input)).toEqual({
      ok: true,
      output: jwtExample.output,
    });
  });

  it("accepts an empty signature segment as absent", () => {
    const result = calculateJwt({
      token: "eyJhbGciOiJub25lIn0.eyJzdWIiOiJhIn0.",
    });
    expect(result.signaturePresent).toBe(false);
    expect(result.signatureHex).toBe("");
    expect(result.header).toEqual({ alg: "none" });
    expect(result.payload).toEqual({ sub: "a" });
  });

  it("rejects tokens with the wrong segment count", () => {
    expect(runJwt({ token: "abc.def" }).ok).toBe(false);
    expect(runJwt({ token: "a.b.c.d" }).ok).toBe(false);
  });

  it("rejects non-JSON segments with structured errors", () => {
    const result = runJwt({
      token: "bm90IGpzb24.bm90IGpzb24.sig",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.issues[0]?.code).toBe("invalid_json_segment");
  });

  it("reports unverified status regardless of signature", () => {
    expect(calculateJwt(jwtExample.input).status).toBe("unverified");
  });
});
