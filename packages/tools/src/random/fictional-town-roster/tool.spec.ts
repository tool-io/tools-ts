import { expect, it } from "vitest";
import tool, {
  calculateFictionalTownRoster,
  fictionalTownRosterExample as example,
} from "./tool.js";
import { fictionCraftContractTests } from "../m250-fiction-craft-testing.js";
fictionCraftContractTests(tool, calculateFictionalTownRoster, example);
it("supports repeated names while enforcing household capacity and stable labels", () => {
  const r = tool.execute({
    ...example.input,
    names: ["Mira"],
    repeatNames: true,
  });
  if (!r.ok) throw new Error("Expected roster");
  expect(r.output.residents.map((v) => v.name)).toEqual(["Mira", "Mira"]);
  expect(new Set(r.output.residents.map((v) => v.id)).size).toBe(2);
  for (const h of example.input.households) {
    const rows = r.output.residents.filter((v) => v.householdId === h.id);
    expect(rows.length).toBeLessThanOrEqual(h.capacity);
    expect(rows.every((v) => v.householdLabel === h.label)).toBe(true);
  }
});
it("rejects shortages, duplicate names and excessive counts", () => {
  expect(tool.execute({ ...example.input, count: 3 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "infeasible_roster", field: "count" }] },
  });
  expect(
    tool.execute({ ...example.input, names: ["Mira", "Mira"] }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "duplicate_identity" }] },
  });
  expect(tool.execute({ ...example.input, count: 129 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "count" }] },
  });
});
