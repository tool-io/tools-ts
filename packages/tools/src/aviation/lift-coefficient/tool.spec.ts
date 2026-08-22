import { describe, expect, it } from "vitest";
import { liftCoefficientExample, runLiftCoefficient } from "./tool.js";
describe("lift coefficient calculator", () => {
  it("reproduces its canonical example exactly", () => {
    const r = runLiftCoefficient(liftCoefficientExample.input);
    if (!r.ok) throw new Error("expected success");
    expect(r.output.liftCoefficient).toBeCloseTo(0.4068762079137423, 9);
  });
});
