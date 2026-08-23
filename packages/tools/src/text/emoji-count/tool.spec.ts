import { describe, expect, it } from "vitest";
import { runEmojiCount } from "./tool.js";

describe("Emoji Count Tool", () => {
  it("calculates the canonical example", () =>
    expect(runEmojiCount({ text: "Great job! 🎉🚀" })).toEqual({
      ok: true,
      output: { emojiCount: 2 },
    }));

  it("returns zero for plain ASCII text", () =>
    expect(runEmojiCount({ text: "plain ASCII text 123" })).toEqual({
      ok: true,
      output: { emojiCount: 0 },
    }));

  it("counts a single emoji", () =>
    expect(runEmojiCount({ text: "🚀" })).toEqual({
      ok: true,
      output: { emojiCount: 1 },
    }));

  it("counts each person in a joined emoji sequence", () =>
    expect(runEmojiCount({ text: "👨‍👩‍👧" })).toEqual({
      ok: true,
      output: { emojiCount: 3 },
    }));

  it("does not count regional indicator flags", () =>
    expect(runEmojiCount({ text: "🇯🇵" })).toEqual({
      ok: true,
      output: { emojiCount: 0 },
    }));

  it("returns zero for empty text", () =>
    expect(runEmojiCount({ text: "" })).toEqual({
      ok: true,
      output: { emojiCount: 0 },
    }));

  it("rejects a missing field", () => expect(runEmojiCount({}).ok).toBe(false));

  it("rejects non-string input", () =>
    expect(runEmojiCount({ text: 42 }).ok).toBe(false));
});
