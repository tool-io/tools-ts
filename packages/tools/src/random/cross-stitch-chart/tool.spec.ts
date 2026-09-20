import { expect, it } from "vitest";
import tool, {
  calculateCrossStitchChart,
  crossStitchChartExample as example,
} from "./tool.js";
import { fictionCraftContractTests } from "../m250-fiction-craft-testing.js";
fictionCraftContractTests(tool, calculateCrossStitchChart, example);
it("independently reconciles each stitch and preserves unused inventory rows", () => {
  const r = tool.execute({
    ...example.input,
    symbols: ["X", "O", "+"],
    threads: [
      ...example.input.threads,
      { id: "gold", color: "gold", availableStitches: 0 },
    ],
  });
  if (!r.ok) throw new Error("Expected chart");
  expect(r.output.legend[2].stitches).toBe(0);
  for (const row of r.output.legend)
    expect(
      r.output.threadGrid.flat().filter((id) => id === row.id).length,
    ).toBe(row.stitches);
  for (let i = 0; i < 6; i++)
    expect(r.output.symbolGrid.flat()[i]).toBe(
      r.output.legend.find((t) => t.id === r.output.threadGrid.flat()[i])
        ?.symbol,
    );
});
it("rejects inventory shortages, duplicate symbols and oversized grids", () => {
  expect(tool.execute({ ...example.input, columns: 4 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "insufficient_thread_inventory" }] },
  });
  expect(tool.execute({ ...example.input, symbols: ["X", "X"] })).toMatchObject(
    { ok: false, error: { issues: [{ code: "duplicate_identity" }] } },
  );
  expect(tool.execute({ ...example.input, symbols: ["X"] })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "insufficient_symbols", field: "symbols" }] },
  });
  expect(tool.execute({ ...example.input, rows: 33 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "rows" }] },
  });
});
