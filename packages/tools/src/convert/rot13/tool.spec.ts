import { describe, expect, it } from "vitest";
import { applyRot13, rot13Example, runRot13 } from "./tool.js";

describe("ROT13 Converter", () => {
  it("matches the known transformation", () =>
    expect(applyRot13("Tool.io is awesome!")).toBe("Gbby.vb vf njrfbzr!"));
  it("returns the original text after two applications", () => {
    const input = "Hello, 世界!";
    expect(applyRot13(applyRot13(input)!)).toBe(input);
  });
  it("rejects empty text", () => expect(applyRot13("")).toBeNull());
  it("publishes an executable example", () =>
    expect(runRot13(rot13Example.input)).toEqual({
      ok: true,
      output: rot13Example.output,
    }));
});
