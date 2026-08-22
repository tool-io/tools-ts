import { describe, expect, it } from "vitest";
import { usefulLoadExample, runUsefulLoad } from "./tool.js";
describe("useful load calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runUsefulLoad(usefulLoadExample.input)).toEqual({
      ok: true,
      output: usefulLoadExample.output,
    });
  });
});
