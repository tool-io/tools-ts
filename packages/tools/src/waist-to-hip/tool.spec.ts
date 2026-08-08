import { describe, expect, it } from "vitest";
import { runWaistToHip, waistToHipExample } from "./tool.js";
describe("waist to hip", () => {
  it("publishes an executable example", () =>
    expect(runWaistToHip(waistToHipExample.input)).toEqual({
      ok: true,
      output: waistToHipExample.output,
    }));
});
