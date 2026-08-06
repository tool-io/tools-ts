import { describe, expect, it } from "vitest";
import { opticsExample, runOptics, runOpticsTool } from "./tool.js";
describe("OPTICS", () => {
  it("orders every point", () =>
    expect(runOptics(opticsExample.input.points, 0.5, 3)).toHaveLength(6));
  it("publishes an executable example", () =>
    expect(runOpticsTool(opticsExample.input)).toEqual({
      ok: true,
      output: opticsExample.output,
    }));
});
