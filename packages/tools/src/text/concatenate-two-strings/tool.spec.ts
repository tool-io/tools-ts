import { describe, expect, it } from "vitest";
import {
  concatenateTwoStrings,
  concatenateTwoStringsExample,
  runConcatenateTwoStrings,
} from "./tool.js";

describe("Concatenate Two Strings", () => {
  it("joins both strings exactly", () =>
    expect(concatenateTwoStrings("Tool.", "io")).toBe("Tool.io"));
  it("preserves empty strings", () =>
    expect(concatenateTwoStrings("", "text")).toBe("text"));
  it("publishes an executable example", () =>
    expect(
      runConcatenateTwoStrings(concatenateTwoStringsExample.input),
    ).toEqual({ ok: true, output: concatenateTwoStringsExample.output }));
});
