import { describe, expect, it } from "vitest";
import { runMode } from "./tool.js";

describe("Mode Calculator", () => {
  it("returns all modes and their frequency", () =>
    expect(runMode({ values: [4, 2, 4, 2, 9] })).toEqual({
      ok: true,
      output: { frequency: 2, modes: [2, 4] },
    }));

  it("rejects an empty list", () =>
    expect(runMode({ values: [] }).ok).toBe(false));
});
