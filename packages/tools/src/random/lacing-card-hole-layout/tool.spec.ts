import { expect, it } from "vitest";
import tool, { example, calculateLacingCardHoleLayout } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculateLacingCardHoleLayout);
it("lightweight square corner spacing and exact-end phase rejection", () => {
  const r = tool.execute({
    ...example.input,
    outline: [
      [0, 0],
      [2, 0],
      [2, 2],
      [0, 2],
    ],
  });
  if (!r.ok) throw new Error("Expected corner holes");
  expect(r.output.holes.map((h) => h.point)).toEqual([
    [0, 0],
    [2, 0],
    [2, 2],
    [0, 2],
  ]);
  expect(r.output.minimumPairDistance).toBe(2);
  expect(tool.execute({ ...example.input, minimumSpacing: 3 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "minimumSpacing", code: "spacing_violation" }] },
  });
  expect(tool.execute({ ...example.input, phaseTurns: [1] })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "phaseTurns", code: "invalid_field" }] },
  });
});
