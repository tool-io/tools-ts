import { expect, it } from "vitest";
import tool, { example, calculateMoireLineInterference } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculateMoireLineInterference);
it("lightweight offset clipping and line-count preflight", () => {
  const r = tool.execute({
    ...example.input,
    families: example.input.families.map((f) => ({ ...f, offsets: [0.5] })),
  });
  if (!r.ok) throw new Error("Expected lines");
  expect(r.output.lines).toHaveLength(4);
  expect(r.output.lines[0]).toMatchObject({ from: [0, 0.5], to: [2, 0.5] });
  expect(tool.execute({ ...example.input, width: 200 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "resource_limit_exceeded" }] },
  });
});
