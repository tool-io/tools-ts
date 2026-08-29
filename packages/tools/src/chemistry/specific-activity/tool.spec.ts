import { describe, expect, it } from "vitest";
import { runSpecificActivity } from "./tool.js";

describe("Specific Activity Calculator", () => {
  it("calculates a valid result", () => {
    expect(runSpecificActivity({ activityBq: 5000, sampleMassG: 2 })).toEqual({
      ok: true,
      output: { bqPerGram: 2500 },
    });
  });

  it("rejects invalid input", () =>
    expect(runSpecificActivity(null).ok).toBe(false));
});
