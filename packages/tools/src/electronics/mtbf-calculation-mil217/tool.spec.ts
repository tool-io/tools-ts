import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";
describe("MIL-217-Style Parts-Count MTBF", () => {
  it("matches the worked example", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("rejects an invalid input", () =>
    expect(
      tool.execute({ ...example.input, baseFailureRatePerHour: null }).ok,
    ).toBe(false));
});
