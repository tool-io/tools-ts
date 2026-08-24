import { describe, expect, it } from "vitest";
import {
  fathomsToMetersExample as example,
  runFathomsToMeters,
} from "./tool.js";
describe("fathoms to meters", () => {
  it("uses the exact international fathom", () =>
    expect(runFathomsToMeters(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("accepts zero and rejects negative depth", () => {
    expect(runFathomsToMeters({ fathoms: 0 })).toEqual({
      ok: true,
      output: { meters: 0 },
    });
    expect(runFathomsToMeters({ fathoms: -1 }).ok).toBe(false);
  });
});
