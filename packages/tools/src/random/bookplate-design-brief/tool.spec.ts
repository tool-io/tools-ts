import { expect, it } from "vitest";
import tool, { example, calculateBookplateDesignBrief } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculateBookplateDesignBrief);
it("lightweight caller label preservation and inset error", () => {
  const r = tool.execute({
    ...example.input,
    owners: ["LongOwnerName"],
    wrapWidth: 4,
  });
  if (!r.ok) throw new Error("Expected wrapped specification");
  expect(
    r.output.specifications[0].wrappedText.split("\n").slice(0, 2),
  ).toEqual(["Owner:", "LongOwnerName."]);
  expect(tool.execute({ ...example.input, inset: 3 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "inset", code: "invalid_interior" }] },
  });
});
