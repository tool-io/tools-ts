import { expect, it } from "vitest";
import tool, {
  calculateInWorldNewspaperFrontPage,
  inWorldNewspaperFrontPageExample as example,
} from "./tool.js";
import { fictionCraftContractTests } from "../m250-fiction-craft-testing.js";
fictionCraftContractTests(tool, calculateInWorldNewspaperFrontPage, example);
it("respects zero budgets and never cuts a surrogate pair in half", () => {
  const r = tool.execute({
    ...example.input,
    slotCount: 1,
    stories: [{ id: "moon", headline: "A🌙B", excerpt: "Evening" }],
    headlineLimit: 2,
    excerptLimit: 0,
  });
  expect(r).toMatchObject({
    ok: true,
    output: {
      slots: [
        {
          headline: "A",
          excerpt: "",
          wrappedExcerpt: "",
          lineCount: 0,
          headlineTruncated: true,
          excerptTruncated: true,
        },
      ],
    },
  });
});
it("rejects slot shortages and oversized page counts", () => {
  expect(tool.execute({ ...example.input, slotCount: 3 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "infeasible_slot_count" }] },
  });
  expect(tool.execute({ ...example.input, slotCount: 33 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "slotCount" }] },
  });
});
