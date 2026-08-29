import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";
describe("Grade 1 Braille decoder", () => {
  it("reads a numeric run", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
});
