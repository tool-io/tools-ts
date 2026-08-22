import { describe, expect, it } from "vitest";
import { dynamicPressureExample, runDynamicPressure } from "./tool.js";
describe("dynamic pressure calculator", () => {
  it("reproduces its canonical example exactly", () => {
    const r = runDynamicPressure(dynamicPressureExample.input);
    if (!r.ok) throw new Error("expected success");
    expect(r.output.dynamicPressurePsf).toBeCloseTo(33.8554, 4);
  });
});
