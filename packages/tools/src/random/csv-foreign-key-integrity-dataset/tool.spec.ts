import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateCsvForeignKeyIntegrityDataset,
} from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("CSV foreign key truth", () => {
  lightweightModelTests(tool, calculateCsvForeignKeyIntegrityDataset, example);
  it("lightweight independently checks all-orphan and zero-orphan boundaries", () => {
    const all = tool.execute({
      parentCount: 1,
      childCount: 2,
      orphanCount: 2,
      seed: 42,
    });
    if (!all.ok) throw new Error("Expected all-orphan corpus");
    expect(all.output.orphanIndices).toEqual([0, 1]);
    expect(all.output.matchRate).toBe(0);
    expect(
      all.output.children.every(
        (child) => !all.output.parents.includes(child.parentKey),
      ),
    ).toBe(true);
    expect(
      tool.execute({ parentCount: 1, childCount: 2, orphanCount: 0, seed: 42 }),
    ).toMatchObject({ ok: true, output: { orphanIndices: [], matchRate: 1 } });
  });
  it("lightweight rejects orphan counts above child counts", () => {
    expect(tool.execute({ ...example.input, orphanCount: 4 })).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "orphanCount", code: "infeasible_orphan_count" }],
      },
    });
  });
});
