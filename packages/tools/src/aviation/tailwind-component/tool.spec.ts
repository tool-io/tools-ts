import { describe, expect, it } from "vitest";
import { tailwindComponentExample, runTailwindComponent } from "./tool.js";
describe("tailwind component calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTailwindComponent(tailwindComponentExample.input)).toEqual({
      ok: true,
      output: tailwindComponentExample.output,
    });
  });
});
