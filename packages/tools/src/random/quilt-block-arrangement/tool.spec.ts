import { expect, it } from "vitest";
import tool, {
  calculateQuiltBlockArrangement,
  quiltBlockArrangementExample as example,
} from "./tool.js";
import { fictionCraftContractTests } from "../m250-fiction-craft-testing.js";
fictionCraftContractTests(tool, calculateQuiltBlockArrangement, example);
it("mirrors before rotating using a hand-derived asymmetric block", () => {
  expect(
    tool.execute(
      {
        rows: 1,
        columns: 1,
        blocks: [
          {
            id: "a",
            matrix: [
              [1, 2],
              [3, 4],
            ],
            quarterTurns: [1],
            allowReflection: true,
          },
        ],
      },
      { random: () => 0.25 },
    ),
  ).toMatchObject({
    ok: true,
    output: {
      placements: [
        {
          reflected: true,
          quarterTurns: 1,
          matrix: [
            [4, 2],
            [3, 1],
          ],
        },
      ],
    },
  });
});
it("rejects ragged blocks, duplicate rotations and oversized grids", () => {
  expect(
    tool.execute({
      ...example.input,
      blocks: [{ ...example.input.blocks[0], matrix: [[1], [2, 3]] }],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_matrix" }] },
  });
  expect(
    tool.execute({
      ...example.input,
      blocks: [{ ...example.input.blocks[0], quarterTurns: [0, 0] }],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "duplicate_identity" }] },
  });
  expect(tool.execute({ ...example.input, columns: 17 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "columns" }] },
  });
});
