import { describe, expect, it } from "vitest";
import {
  calculateAlbumPageSlotCapacity,
  example,
  runAlbumPageSlotCapacity,
} from "./tool.js";

describe("numismatics/album-page-slot-capacity", () => {
  it("calculates the published example", () => {
    expect(calculateAlbumPageSlotCapacity(example.input)).toEqual(
      example.output,
    );
    expect(runAlbumPageSlotCapacity(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runAlbumPageSlotCapacity({
      ...example.input,
      rows: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
