import { describe, expect, it } from "vitest";
import {
  phiRegionBucketLookupExample,
  runPhiRegionBucketLookup,
} from "./tool.js";

describe("phi-region-bucket-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPhiRegionBucketLookup(phiRegionBucketLookupExample.input),
    ).toEqual({
      ok: true,
      output: phiRegionBucketLookupExample.output,
    });
  });

  it("places small numbers in the first bucket and honors boundaries", () => {
    const low = runPhiRegionBucketLookup({ cdNumber: 42 });
    const edge = runPhiRegionBucketLookup({ cdNumber: 1000 });
    if (!low.ok || !edge.ok) throw new Error("expected success");
    expect(low.output.bucketLabel as string).toBe("0-999");
    expect(edge.output.bucketStart as number).toBe(1000);
  });
  it("rejects non-positive numbers", () => {
    expect(runPhiRegionBucketLookup({ cdNumber: 0 }).ok).toBe(false);
  });
});
