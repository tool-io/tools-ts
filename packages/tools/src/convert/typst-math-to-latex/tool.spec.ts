import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";
describe("Typst subset conversion", () => {
  it("converts powers and roots", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
});
