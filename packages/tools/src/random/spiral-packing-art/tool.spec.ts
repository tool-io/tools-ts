import { expect, it } from "vitest";
import tool, { example, calculateSpiralPackingArt } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculateSpiralPackingArt);
it("lightweight overlap rejection preserves an explicit unsuccessful attempt", () => {
  const r = tool.execute({ ...example.input, stepTurns: 1 });
  if (!r.ok) throw new Error("Expected trace");
  expect(r.output.acceptedCount).toBe(1);
  expect(r.output.attempts[1]).toMatchObject({
    accepted: false,
    blockedBy: [0],
  });
  expect(tool.execute({ ...example.input, attempts: 65 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "attempts", code: "invalid_field" }] },
  });
});
