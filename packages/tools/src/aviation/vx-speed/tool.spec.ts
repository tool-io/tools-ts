import { describe, expect, it } from "vitest";
import { vxSpeedExample, runVxSpeed } from "./tool.js";
describe("vx speed calculator", () => {
  it("reproduces its canonical example exactly", () => {
    const r = runVxSpeed(vxSpeedExample.input);
    if (!r.ok) throw new Error("expected success");
    expect(r.output.vxKt).toBeCloseTo(vxSpeedExample.output.vxKt, 9);
  });
});
