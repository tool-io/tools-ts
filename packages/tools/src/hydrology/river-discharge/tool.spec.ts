import { describe, expect, it } from "vitest";
import { riverDischargeExample, runRiverDischarge } from "./tool.js";
describe("river discharge", () => {
  it("publishes an executable example", () =>
    expect(runRiverDischarge(riverDischargeExample.input)).toEqual({
      ok: true,
      output: riverDischargeExample.output,
    }));
});
