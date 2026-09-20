import { expect, it } from "vitest";
import tool, { example, calculateFractalTreeBranchLayout } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculateFractalTreeBranchLayout);
it("lightweight parent endpoints and geometric length decay", () => {
  const r = tool.execute({ ...example.input, depth: 2 });
  if (!r.ok) throw new Error("Expected branches");
  expect(r.output.branches).toHaveLength(7);
  for (const b of r.output.branches.slice(1)) {
    expect(b.from).toEqual(r.output.branches[b.parent].to);
    expect(b.length).toBe(b.depth === 1 ? 2 : 1);
  }
  expect(
    tool.execute({ ...example.input, maximumAngleTurns: 0 }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "maximumAngleTurns", code: "invalid_range" }] },
  });
});
it("lightweight accepted negative-zero heading normalizes without mutating input", () => {
  const input = { ...example.input, headingTurns: -0 },
    r = tool.execute(input);
  if (!r.ok) throw new Error("Expected normalized heading");
  expect(Object.is(r.output.branches[0].headingTurns, 0)).toBe(true);
  expect(JSON.parse(JSON.stringify(r.output))).toEqual(r.output);
  expect(Object.is(input.headingTurns, -0)).toBe(true);
});
