import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";
describe("Vigenère decoder", () =>
  it("decodes the standard vector", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    })));
