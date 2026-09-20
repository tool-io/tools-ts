import { expect, it } from "vitest";
import tool, {
  calculateFantasyTavernMenuCard,
  fantasyTavernMenuCardExample as example,
} from "./tool.js";
import { fictionCraftContractTests } from "../m250-fiction-craft-testing.js";
fictionCraftContractTests(tool, calculateFantasyTavernMenuCard, example);
it("preserves descriptions, distinct IDs and interval endpoints", () => {
  const { seed, ...x } = example.input;
  const r = tool.execute(x, { random: () => 0 });
  if (!r.ok) throw new Error("Expected menu");
  expect(r.output.items.map((v) => v.price)).toEqual([3, 1]);
  expect(r.output.items.map((v) => v.description)).toEqual([
    "Harbor vegetable stew",
    "Orchard leaf tea",
  ]);
});
it("rejects reversed price intervals and impossible quantities", () => {
  expect(
    tool.execute({
      ...example.input,
      items: [{ ...example.input.items[0], maximumPrice: 2 }],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "infeasible_item_count" }] },
  });
  expect(
    tool.execute({
      ...example.input,
      count: 1,
      items: [{ ...example.input.items[0], maximumPrice: 2 }],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_price_range", field: "items" }] },
  });
  expect(tool.execute({ ...example.input, count: 33 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "count" }] },
  });
});
