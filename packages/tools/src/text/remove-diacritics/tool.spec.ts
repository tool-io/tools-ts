import { describe, expect, it } from "vitest";
import { runRemoveDiacritics } from "./tool.js";

describe("Remove Diacritics Tool", () => {
  it("strips diacritics from accented text", () => {
    expect(runRemoveDiacritics({ text: "café résumé" })).toEqual({
      ok: true,
      output: { plainText: "cafe resume" },
    });
  });

  it("rejects invalid input", () =>
    expect(runRemoveDiacritics(null).ok).toBe(false));
});
