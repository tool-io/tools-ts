import { describe, expect, it } from "vitest";
import {
  nauticalMileToKmExample as example,
  runNauticalMileToKm,
} from "./tool.js";
describe("nautical miles to kilometers", () => {
  it("uses the exact 1.852 factor", () =>
    expect(runNauticalMileToKm(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("accepts zero and rejects negative distance", () => {
    expect(runNauticalMileToKm({ nauticalMiles: 0 })).toEqual({
      ok: true,
      output: { kilometers: 0 },
    });
    expect(runNauticalMileToKm({ nauticalMiles: -1 }).ok).toBe(false);
  });
});
