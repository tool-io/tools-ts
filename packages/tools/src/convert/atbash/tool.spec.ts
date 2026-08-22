import { describe, expect, it } from "vitest";
import { atbashExample, runAtbash } from "./tool.js";
describe("atbash cipher", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runAtbash(atbashExample.input)).toEqual({
      ok: true,
      output: atbashExample.output,
    });
  });
  it("is self-inverse", () => {
    const r1 = runAtbash({ text: "Attack at dawn" });
    if (!r1.ok) return;
    const r2 = runAtbash({ text: r1.output.result });
    if (!r2.ok) return;
    expect(r2.output.result).toBe("Attack at dawn");
  });
});
