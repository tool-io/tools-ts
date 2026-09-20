import { expect, it } from "vitest";
import tool, {
  calculateTruchetTileMosaic,
  truchetTileMosaicExample as example,
} from "./tool.js";
import { fictionCraftContractTests } from "../m250-fiction-craft-testing.js";
fictionCraftContractTests(tool, calculateTruchetTileMosaic, example);
it("rotates compass labels clockwise independently of the matrix helper", () => {
  const r = tool.execute({
    rows: 1,
    columns: 1,
    motifs: [{ id: "turn", edges: ["n", "e", "s", "w"], quarterTurns: [1] }],
    matchEdges: true,
    outsideLabel: "",
    seed: 9,
  });
  expect(r).toMatchObject({
    ok: true,
    output: { grid: [[{ edges: ["w", "n", "e", "s"] }]] },
  });
});
it("rejects incompatible boundaries, repeated rotations and oversized grids", () => {
  expect(tool.execute({ ...example.input, outsideLabel: "z" })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "infeasible_mosaic" }] },
  });
  expect(
    tool.execute({
      ...example.input,
      motifs: [{ ...example.input.motifs[0], quarterTurns: [0, 0] }],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "duplicate_identity" }] },
  });
  expect(tool.execute({ ...example.input, rows: 17 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "rows" }] },
  });
});
