import { describe, expect, it } from "vitest";
import {
  calculateDiskImageTbAggregator,
  diskImageTbAggregatorExample,
  runDiskImageTbAggregator,
} from "./tool.js";

describe("archival-studies/disk-image-tb-aggregator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDiskImageTbAggregator(diskImageTbAggregatorExample.input),
    ).toEqual({ ok: true, output: diskImageTbAggregatorExample.output });
  });

  it("aggregates a single image", () => {
    const result = calculateDiskImageTbAggregator({ sizesTb: [3] });
    expect(result.imageCount).toBe(1);
    expect(result.totalTb).toBe(3);
    expect(result.averageTb).toBe(3);
  });

  it("rejects negative sizes and empty lists", () => {
    expect(runDiskImageTbAggregator({ sizesTb: [1, -2] }).ok).toBe(false);
    expect(runDiskImageTbAggregator({ sizesTb: [] }).ok).toBe(false);
  });
});
