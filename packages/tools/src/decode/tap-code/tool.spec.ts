import { describe, expect, it } from "vitest";
import { runTapCode, tapCodeExample } from "./tool.js";
describe("tap code decoder", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTapCode(tapCodeExample.input)).toEqual({
      ok: true,
      output: tapCodeExample.output,
    });
  });
  it("flags malformed groups with placeholders", () => {
    const r = runTapCode({ taps: "11 99" });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.output.invalidGroups).toEqual([1]);
      expect(r.output.text).toBe("A?");
    }
  });
});
