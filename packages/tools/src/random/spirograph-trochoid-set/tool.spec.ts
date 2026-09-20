import { expect, it } from "vitest";
import tool, { example, calculateSpirographTrochoidSet } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculateSpirographTrochoidSet);
it("lightweight rational closure and invalid rolling radius", () => {
  const r = tool.execute({
    ...example.input,
    minimumFixedRadius: 5,
    maximumFixedRadius: 5,
  });
  if (!r.ok) throw new Error("Expected closed curve");
  expect(r.output.curves[0].closureTurns).toBe(2);
  expect(r.output.curves[0].points[4]).toEqual(r.output.curves[0].points[0]);
  expect(
    tool.execute({ ...example.input, maximumRollingRadius: 4 }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ field: "maximumRollingRadius", code: "invalid_radii" }],
    },
  });
});
