import { describe, expect, it } from "vitest";
import { textToBinaryStringExample, textToBinaryStringTool } from "./tool.js";
import { runTextToBinaryString } from "./tool.js";

const issueDetail = (input: unknown) => {
  const result = runTextToBinaryString(input);
  return result.ok ? null : result.error.issues[0];
};

describe("Text to Binary String Converter", () => {
  it("publishes an executable example with its exact verified output", () => {
    expect(runTextToBinaryString(textToBinaryStringExample.input)).toEqual({
      ok: true,
      output: textToBinaryStringExample.output,
    });
  });

  it("declares the convert/text-to-binary-string tool id", () => {
    expect(textToBinaryStringTool.id).toBe("convert/text-to-binary-string");
    expect(textToBinaryStringTool.title).toBe(
      "Text to Binary String Converter",
    );
  });

  it("converts a single character to one padded byte group", () => {
    expect(runTextToBinaryString({ text: "A" })).toEqual({
      ok: true,
      output: { binary: "01000001" },
    });
  });

  it("pads groups below 256 with leading zeros", () => {
    expect(runTextToBinaryString({ text: "\u0000" })).toEqual({
      ok: true,
      output: { binary: "00000000" },
    });
    expect(runTextToBinaryString({ text: " " })).toEqual({
      ok: true,
      output: { binary: "00100000" },
    });
  });

  it("joins multiple characters with single spaces", () => {
    expect(runTextToBinaryString({ text: "Hi!" })).toEqual({
      ok: true,
      output: { binary: "01001000 01101001 00100001" },
    });
  });

  it("supports the full Latin-1 upper range", () => {
    expect(runTextToBinaryString({ text: "\u00e9" })).toEqual({
      ok: true,
      output: { binary: "11101001" },
    });
    expect(runTextToBinaryString({ text: "\u00ff" })).toEqual({
      ok: true,
      output: { binary: "11111111" },
    });
  });

  it("rejects empty text with a structured empty_text error", () => {
    expect(issueDetail({ text: "" })).toEqual({
      code: "empty_text",
      field: "text",
      message: "Text must not be empty.",
    });
  });

  it("rejects characters beyond Latin-1 with unsupported_character", () => {
    expect(issueDetail({ text: "\u20ac" })).toEqual({
      code: "unsupported_character",
      field: "text",
      message: "Only Latin-1 characters are supported.",
    });
    expect(issueDetail({ text: "\u{1F600}" })).toEqual({
      code: "unsupported_character",
      field: "text",
      message: "Only Latin-1 characters are supported.",
    });
  });

  it("reports unsupported characters after valid prefixes", () => {
    expect(issueDetail({ text: "a\u0100z" })).toEqual({
      code: "unsupported_character",
      field: "text",
      message: "Only Latin-1 characters are supported.",
    });
  });

  it("produces one group per input character", () => {
    const result = runTextToBinaryString({ text: "abcde" });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(String(result.output.binary).split(" ").length).toBe(5);
  });
});
