import { expect, it } from "vitest";
import tool, { example, calculatePatchworkFabricAllocation } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculatePatchworkFabricAllocation);
it("lightweight quota conservation and unavailable direction", () => {
  const r = tool.execute({
    ...example.input,
    fabrics: example.input.fabrics.map((f) => ({ ...f, quota: 2 })),
  });
  if (!r.ok) throw new Error("Expected allocation");
  expect(r.output.remainingQuotas).toEqual([
    { id: "A", quota: 1 },
    { id: "B", quota: 1 },
  ]);
  expect(
    tool.execute({
      ...example.input,
      slots: example.input.slots.map((s) => ({
        ...s,
        requiredDirection: "diagonal",
      })),
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "fabrics", code: "infeasible_allocation" }] },
  });
});
