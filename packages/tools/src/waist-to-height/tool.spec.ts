import { describe, expect, it } from "vitest";
import { runWaistToHeight, waistToHeightExample } from "./tool.js";
describe("waist to height", () => {
  it("publishes an executable example", () =>
    expect(runWaistToHeight(waistToHeightExample.input)).toEqual({
      ok: true,
      output: waistToHeightExample.output,
    }));
});
