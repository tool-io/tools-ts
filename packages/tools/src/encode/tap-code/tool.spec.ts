import { describe, expect, it } from "vitest";
import { runTapCode, tapCodeExample } from "./tool.js";
describe("tap code encoder", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTapCode(tapCodeExample.input)).toEqual({
      ok: true,
      output: tapCodeExample.output,
    });
  });
  it("encodes K as C per POW convention", () => {
    const r = runTapCode({ text: "K" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.output.taps).toBe("13");
  });
});
