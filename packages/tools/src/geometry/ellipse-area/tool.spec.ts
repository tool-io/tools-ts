import { describe, expect, it } from "vitest";
import { runEllipseArea } from "./tool.js";
describe("ellipse area calculator", () => {
  it("reproduces its canonical example exactly", () => {
    const r = runEllipseArea({ semiMajorAxis: 5, semiMinorAxis: 3 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.area).toBeCloseTo(47.12388980384689, 6);
  });
});
