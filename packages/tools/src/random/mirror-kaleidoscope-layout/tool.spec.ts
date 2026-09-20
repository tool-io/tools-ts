import { expect, it } from "vitest";
import tool, { example, calculateMirrorKaleidoscopeLayout } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculateMirrorKaleidoscopeLayout);
it("lightweight segment clipping and wedge rejection", () => {
  const r = tool.execute({
    ...example.input,
    motif: [
      [0, 0],
      [3, 0],
    ],
    clipHalfSize: 1,
  });
  if (!r.ok) throw new Error("Expected clipping");
  expect(r.output.segments[0]).toMatchObject({ from: [0, 0], to: [1, 0] });
  expect(
    tool.execute({
      ...example.input,
      motif: [
        [1, -1],
        [2, 0],
      ],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "motif", code: "outside_wedge" }] },
  });
});
