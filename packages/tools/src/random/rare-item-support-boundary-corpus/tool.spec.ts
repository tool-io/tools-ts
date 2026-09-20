import { expect, it } from "vitest";
import tool, {
  calculateRareItemSupportBoundaryCorpus,
  rareItemSupportBoundaryCorpusExample as example,
} from "./tool.js";
import { authoredGeneratorTests } from "../m250-algorithms-spec.js";
authoredGeneratorTests(tool, calculateRareItemSupportBoundaryCorpus, example);
it("uses the ceiling cutoff for a nonintegral support product", () => {
  const result = calculateRareItemSupportBoundaryCorpus({
    ...example.input,
    transactionCount: 7,
    minimumSupport: 0.3,
    backgroundItems: ["tea", "bread"],
    seed: 17,
  });
  if (!result.ok) throw new Error("expected three boundary corpora");
  expect(result.output.minimumCount).toBe(3);
  expect(
    result.output.cases.map((row) => [row.targetCount, row.frequent]),
  ).toEqual([
    [2, false],
    [3, true],
    [4, true],
  ]);
  for (const row of result.output.cases) {
    expect(
      row.transactions.filter((basket) => basket.includes("rare")).length,
    ).toBe(row.targetCount);
    expect(row.support).toBe(row.targetCount / 7);
    expect(
      row.transactions.every((basket) =>
        basket.some((item) => item === "tea" || item === "bread"),
      ),
    ).toBe(true);
  }
});
it("supports a zero-occurrence below case and rejects unrealizable above cases", () => {
  const result = calculateRareItemSupportBoundaryCorpus({
    ...example.input,
    minimumSupport: 0.1,
  });
  if (!result.ok) throw new Error("expected smallest cutoff");
  expect(result.output.cases[0].targetCount).toBe(0);
  expect(tool.execute({ ...example.input, minimumSupport: 1 })).toMatchObject({
    ok: false,
    error: {
      issues: [
        { code: "infeasible_support_boundary", field: "minimumSupport" },
      ],
    },
  });
  expect(
    tool.execute({ ...example.input, backgroundItems: ["rare"] }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "duplicate_items", field: "backgroundItems" }] },
  });
  expect(
    tool.execute({ ...example.input, transactionCount: 129 }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "transactionCount" }] },
  });
});
