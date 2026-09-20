import { expect, it } from "vitest";
import tool, { example, calculateParametricKnotProjection } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculateParametricKnotProjection);
it("lightweight orthographic xz projection and coprimality", () => {
  const r = tool.execute({ ...example.input, axes: ["xz"] });
  if (!r.ok) throw new Error("Expected projection");
  expect(r.output.points).toEqual([
    [4, 0],
    [-3, -1],
    [2, 0],
    [-3, 1],
    [4, 0],
  ]);
  expect(
    tool.execute({
      ...example.input,
      templates: [{ ...example.input.templates[0], q: 4 }],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "templates", code: "invalid_template" }] },
  });
});
