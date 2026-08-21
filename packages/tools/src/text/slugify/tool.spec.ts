import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateSlugify,
  slugifyExample,
  slugifyTool,
} from "./tool.js";

describe("Slugify", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = slugifyTool.execute(slugifyExample.input);
    expect(result).toEqual({ ok: true, output: slugifyExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(slugifyTool.id).toBe("text/slugify");
    expect(validateToolContract(slugifyTool)).toEqual([]);
  });

  it("supports custom separators and collapses runs", () => {
    const result = calculateSlugify({
      separator: "_",
      text: "  Multiple   spaces & symbols!!  ",
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.slug).toBe("multiple_spaces_symbols");
  });

  it("rejects text without any letters or digits", () => {
    expect(calculateSlugify({ text: "--- *** ---" })).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(calculateSlugify({ text: "" })).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(calculateSlugify(null)).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(calculateSlugify({ extra: true, text: "ok" })).toMatchObject({
      error: { code: "invalid_input" },
    });
  });
});
