import { expect, it } from "vitest";
import tool, { example, calculateZinePageImpositionPlan } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculateZinePageImpositionPlan);
it("lightweight independently derived eight-page signature and unsupported count", () => {
  const r = tool.execute({
    ...example.input,
    contents: ["a", "b", "c", "d", "e", "f", "g", "h"],
    templates: [{ ...example.input.templates[0], pageCount: 8 }],
  });
  if (!r.ok) throw new Error("Expected signatures");
  expect(
    r.output.sheets.map((s) => [
      s.front.map((p) => p.page),
      s.back.map((p) => p.page),
    ]),
  ).toEqual([
    [
      [8, 1],
      [2, 7],
    ],
    [
      [6, 3],
      [4, 5],
    ],
  ]);
  expect(
    tool.execute({
      ...example.input,
      templates: [{ ...example.input.templates[0], pageCount: 5 }],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "templates", code: "unsupported_signature" }] },
  });
});
