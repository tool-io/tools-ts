import { describe, expect, it } from "vitest";
import {
  calculateWaistToHip,
  runWaistToHip,
  waistToHipExample,
} from "./tool.js";
describe("waist to hip", () => {
  it("publishes an executable example", () =>
    expect(runWaistToHip(waistToHipExample.input)).toEqual({
      ok: true,
      output: waistToHipExample.output,
    }));

  it("rejects non-finite and non-positive measurements", () => {
    expect(calculateWaistToHip(70, NaN)).toBeNull();
    expect(calculateWaistToHip(-70, 80)).toBeNull();
  });
});
