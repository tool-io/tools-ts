import { expect, it } from "vitest";
import tool, { example, calculateBeadLoomRowChart } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculateBeadLoomRowChart);
it("lightweight stock conservation and cell preflight", () => {
  const r = tool.execute({ ...example.input, rows: 2, columns: 2 });
  if (!r.ok) throw new Error("Expected chart");
  for (let i = 0; i < 2; i++)
    expect(r.output.colorCounts[i].count + r.output.remaining[i].count).toBe(2);
  expect(
    tool.execute({ ...example.input, colors: [{ id: "red", count: 1 }] }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "colors", code: "insufficient_inventory" }] },
  });
  expect(
    tool.execute({ ...example.input, rows: 16, columns: 16 }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "resource_limit_exceeded" }] },
  });
});
it("lightweight zero-occurrence prototype labels retain numeric zero counts", () => {
  const r = tool.execute({
    ...example.input,
    maximumRun: 3,
    colors: [
      { id: "red", count: 3 },
      { id: "__proto__", count: 0 },
      { id: "constructor", count: 0 },
      { id: "toString", count: 0 },
    ],
  });
  if (!r.ok) throw new Error("Expected reserved-label chart");
  expect(r.output.colorCounts).toEqual([
    { id: "red", count: 3 },
    { id: "__proto__", count: 0 },
    { id: "constructor", count: 0 },
    { id: "toString", count: 0 },
  ]);
});
