import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";
describe("Landing Distance With Wind", () => {
  it("matches the worked example", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("rejects an invalid input", () =>
    expect(tool.execute({ ...example.input, baselineDistance: null }).ok).toBe(
      false,
    ));
});
