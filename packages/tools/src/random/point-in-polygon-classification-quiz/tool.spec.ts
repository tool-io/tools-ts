import { expect, it } from "vitest";
import tool, {
  calculatePointInPolygonClassificationQuiz,
  pointInPolygonClassificationQuizExample as example,
} from "./tool.js";
import { authoredGeneratorTests } from "../m250-algorithms-spec.js";
authoredGeneratorTests(
  tool,
  calculatePointInPolygonClassificationQuiz,
  example,
);
it("classifies generated polygons with independent rectangle and notch inequalities", () => {
  for (const shape of ["rectangle", "l-shape"] as const) {
    const result = calculatePointInPolygonClassificationQuiz({
      ...example.input,
      count: 16,
      shape,
      originMinimum: -20,
      originMaximum: 20,
      minimumExtent: 4,
      maximumExtent: 30,
      seed: 3,
    });
    if (!result.ok) throw new Error("expected polygon bank");
    for (const row of result.output.cases) {
      const p = row.parameters;
      const notch =
        p.cutX !== null && p.cutY !== null
          ? (p.width - p.cutX) * (p.height - p.cutY)
          : 0;
      expect(row.area).toBe(p.width * p.height - notch);
      for (const point of row.points) {
        const dx = point.x - p.x,
          dy = point.y - p.y;
        const inside =
          dx >= 0 &&
          dy >= 0 &&
          dx <= p.width &&
          dy <= p.height &&
          (p.cutX === null || p.cutY === null || dx <= p.cutX || dy <= p.cutY);
        expect(point.inside).toBe(inside);
        expect(point.onBoundary).toBe(point.intended === "boundary");
      }
      expect(row.points.filter((point) => point.onBoundary).length).toBe(2);
    }
  }
});
it("rejects inverted ranges, unsupported extents and coordinate loss", () => {
  expect(
    tool.execute({ ...example.input, originMinimum: 3, originMaximum: 1 }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ code: "invalid_integer_range", field: "originMaximum" }],
    },
  });
  expect(tool.execute({ ...example.input, minimumExtent: 3 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "minimumExtent" }] },
  });
  expect(
    tool.execute({
      ...example.input,
      originMinimum: Number.MAX_SAFE_INTEGER,
      originMaximum: Number.MAX_SAFE_INTEGER,
    }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ code: "coordinate_overflow", field: "maximumExtent" }],
    },
  });
  expect(tool.execute({ ...example.input, count: 17 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "count" }] },
  });
});
