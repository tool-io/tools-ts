import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";
describe("Polymer Number-Average Molecular Mass", () => {
  it("matches the reference distribution", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("rejects mismatched vectors", () =>
    expect(tool.execute({ counts: [1], molarMasses: [100, 200] }).ok).toBe(
      false,
    ));
});
