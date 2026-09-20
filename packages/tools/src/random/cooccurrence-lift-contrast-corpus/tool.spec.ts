import { expect, it } from "vitest";
import tool, {
  calculateCooccurrenceLiftContrastCorpus,
  cooccurrenceLiftContrastCorpusExample as example,
} from "./tool.js";
import { authoredGeneratorTests } from "../m250-algorithms-spec.js";
authoredGeneratorTests(tool, calculateCooccurrenceLiftContrastCorpus, example);
it("constructs exact cells and contrasts the same joint rate against different base rates", () => {
  const result = calculateCooccurrenceLiftContrastCorpus(example.input);
  if (!result.ok) throw new Error("expected constructed contrast");
  expect(result.output.cases.map((row) => row.metrics.lift)).toEqual([2, 1]);
  for (const row of result.output.cases) {
    const observed = { both: 0, onlyA: 0, onlyB: 0, neither: 0 };
    for (const basket of row.transactions) {
      const a = basket.includes("A"),
        b = basket.includes("B");
      observed[a && b ? "both" : a ? "onlyA" : b ? "onlyB" : "neither"] += 1;
    }
    expect(observed).toEqual(row.cells);
  }
});
it("allows disjoint pairs and rejects negative implied cells", () => {
  const result = calculateCooccurrenceLiftContrastCorpus({
    ...example.input,
    designs: [
      {
        label: "disjoint",
        transactionCount: 4,
        countA: 2,
        countB: 2,
        jointCount: 0,
      },
      example.input.designs[1],
    ],
  });
  if (!result.ok) throw new Error("expected disjoint design");
  expect(result.output.cases[0].metrics.lift).toBe(0);
  expect(result.output.cases[0].mining.rules).toEqual([]);
  expect(
    tool.execute({
      ...example.input,
      designs: [
        {
          label: "bad",
          transactionCount: 4,
          countA: 3,
          countB: 3,
          jointCount: 1,
        },
        example.input.designs[1],
      ],
    }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ code: "infeasible_contingency_counts", field: "designs.0" }],
    },
  });
  expect(tool.execute({ ...example.input, neitherItem: "A" })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "duplicate_items" }] },
  });
});
