import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";
import { decodeGradeOneBraille } from "../../braille/grade-one.js";
describe("Grade 1 Braille encoder", () => {
  it("uses one numeric sign per run", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("round-trips capital letters, punctuation and adjacent digits", () => {
    const input = "A1b, 2026!";
    const result = tool.execute({ text: input });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(decodeGradeOneBraille(result.output.braille)).toBe(input);
  });
});
