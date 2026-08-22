import { describe, expect, it } from "vitest";
import { runChordLength } from "./tool.js";
describe("chord length calculator", () => {
  it("chord at 180° equals diameter", () => {
    const r = runChordLength({ angleDeg: 180, radius: 5 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.chordLength).toBe(10);
  });
});
