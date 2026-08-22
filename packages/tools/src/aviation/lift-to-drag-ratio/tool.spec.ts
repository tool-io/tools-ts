import { describe, expect, it } from "vitest";
import { liftToDragRatioExample, runLiftToDragRatio } from "./tool.js";
describe("lift-to-drag ratio calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runLiftToDragRatio(liftToDragRatioExample.input)).toEqual({
      ok: true,
      output: liftToDragRatioExample.output,
    });
  });
});
