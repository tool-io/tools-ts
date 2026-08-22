import { describe, expect, it } from "vitest";
import { runDetab, detabExample } from "./tool.js";
describe("text detab tool", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDetab(detabExample.input)).toEqual({
      ok: true,
      output: detabExample.output,
    });
  });
  it("a tab on a stop boundary inserts a full width", () => {
    const r = runDetab({ text: "abcd\te" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.expandedText).toBe("abcd    e");
  });
});
