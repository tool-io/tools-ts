import { describe, expect, it } from "vitest";
import { runScaleFactorArea } from "./tool.js";
describe("scale factor area calculator", () => {
  it("area scales by k squared not k", () => {
    const r = runScaleFactorArea({ originalArea: 10, scaleFactor: 3 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.scaledArea).toBeCloseTo(90, 9);
  });
});
