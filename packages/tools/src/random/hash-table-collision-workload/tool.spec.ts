import { describe, expect, it } from "vitest";
import tool, { example, calculateHashTableCollisionWorkload } from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("Toy hash collisions", () => {
  lightweightModelTests(tool, calculateHashTableCollisionWorkload, example);
  it("lightweight independently preserves congruence with a signed offset", () => {
    const result = tool.execute(
      {
        bucketCount: 4,
        targetBucket: 1,
        multiplier: 2,
        offset: -1,
        collidingCount: 2,
        noiseCount: 0,
      },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected reachable residue");
    expect(result.output.keys).toEqual([1, 4001]);
    expect(result.output.buckets).toEqual([1, 1]);
    expect(result.output.bucketCounts).toEqual([0, 2, 0, 0]);
    expect(result.output.collisionPairs).toEqual([[0, 1]]);
  });
  it("lightweight proves an unreachable non-coprime bucket and rejects table-range errors", () => {
    expect(
      tool.execute({
        ...example.input,
        bucketCount: 4,
        multiplier: 2,
        targetBucket: 1,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "targetBucket", code: "unreachable_bucket" }],
      },
    });
    expect(tool.execute({ ...example.input, targetBucket: 3 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "targetBucket", code: "bucket_range" }] },
    });
  });
});
