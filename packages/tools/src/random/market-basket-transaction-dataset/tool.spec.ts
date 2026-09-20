import { expect, it } from "vitest";
import tool, {
  calculateMarketBasketTransactionDataset,
  marketBasketTransactionDatasetExample as example,
} from "./tool.js";
import { authoredGeneratorTests } from "../m250-algorithms-spec.js";
authoredGeneratorTests(tool, calculateMarketBasketTransactionDataset, example);
it("counts itemsets and rules independently and preserves planted templates", () => {
  const result = calculateMarketBasketTransactionDataset({
    ...example.input,
    items: ["bread", "milk", "tea", "eggs"],
    transactionCount: 40,
    maximumSize: 3,
    seed: 7,
  });
  if (!result.ok) throw new Error("expected generated baskets");
  const rows = result.output.transactions.map((row) => row.items);
  const count = (items: readonly string[]) =>
    rows.filter((row) => items.every((item) => row.includes(item))).length;
  for (const row of result.output.transactions) {
    expect(new Set(row.items).size).toBe(row.items.length);
    if (row.plantedTemplate === "breakfast")
      expect(row.items).toEqual(expect.arrayContaining(["bread", "milk"]));
  }
  for (const set of result.output.mining.itemsets) {
    expect(set.count).toBe(count(set.items));
    expect(set.support).toBe(set.count / rows.length);
    expect(set.count).toBeGreaterThanOrEqual(Math.ceil(0.25 * rows.length));
  }
  for (const rule of result.output.mining.rules) {
    const joint = count([...rule.antecedent, ...rule.consequent]);
    expect(rule.confidence).toBe(joint / count(rule.antecedent));
    // Algebraically equivalent operation order can differ by one IEEE-754 ulp.
    expect(rule.lift).toBeCloseTo(
      (joint * rows.length) / (count(rule.antecedent) * count(rule.consequent)),
      13,
    );
  }
});
it("constructs rather than selects solved baskets and rejects invalid template identities", () => {
  const full = calculateMarketBasketTransactionDataset({
    ...example.input,
    templateProbability: 1,
    backgroundProbability: 0,
  });
  if (!full.ok) throw new Error("expected full planted baskets");
  expect(
    full.output.transactions.every(
      (row) => row.plantedTemplate === "breakfast" && row.items.length === 2,
    ),
  ).toBe(true);
  expect(
    tool.execute({ ...example.input, items: ["milk", "milk"] }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "duplicate_items", field: "items" }] },
  });
  expect(
    tool.execute({
      ...example.input,
      templates: [{ label: "bad", items: ["unknown"] }],
    }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ code: "unknown_template_item", field: "templates.0.items" }],
    },
  });
  expect(
    tool.execute({ ...example.input, transactionCount: 129 }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "transactionCount" }] },
  });
  const sparse = new Array(2);
  sparse[0] = "milk";
  expect(tool.execute({ ...example.input, items: sparse })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "items" }] },
  });
});
