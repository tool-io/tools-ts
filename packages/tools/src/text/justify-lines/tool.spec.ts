import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";
describe("text line justifier", () =>
  it("wraps the last line without padding", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    })));
