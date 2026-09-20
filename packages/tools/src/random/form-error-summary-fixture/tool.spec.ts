import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateFormErrorSummaryFixture,
  runFormErrorSummaryFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateFormErrorSummaryFixture, example);
    expect(runFormErrorSummaryFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(tool.execute({ ...example.input, selectedCount: 3 })).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "selectedCount", code: "infeasible_error_count" }],
      },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    expect(
      tool.execute({ ...example.input, mode: "wrong-target" }),
    ).toMatchObject({
      ok: true,
      output: {
        missingSummaryIds: ["email"],
        brokenLinkIds: ["email"],
        links: [{ target: "missing-email" }, { target: "name" }],
      },
    });
    expect(
      tool.execute({ ...example.input, mode: "consistent" }),
    ).toMatchObject({
      ok: true,
      output: { missingSummaryIds: [], brokenLinkIds: [] },
    });
  });
});
