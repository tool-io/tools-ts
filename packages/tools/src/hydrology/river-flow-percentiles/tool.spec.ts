import { describe, expect, it } from "vitest";
import {
  riverFlowPercentilesExample,
  runRiverFlowPercentiles,
} from "./tool.js";
describe("river flow percentiles", () => {
  it("publishes an executable example", () =>
    expect(runRiverFlowPercentiles(riverFlowPercentilesExample.input)).toEqual({
      ok: true,
      output: riverFlowPercentilesExample.output,
    }));
});
