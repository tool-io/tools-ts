import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateTableHeaderAssociationFixture,
  runTableHeaderAssociationFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateTableHeaderAssociationFixture, example);
    expect(runTableHeaderAssociationFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(tool.execute({ ...example.input, rows: [["A"]] })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "rows", code: "ragged_table" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    expect(
      tool.execute({ ...example.input, modes: ["missing"] }),
    ).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            headers: [
              { matchesColumnDesign: true },
              {
                scope: null,
                check: { state: "auto", validKeyword: false },
                matchesColumnDesign: false,
              },
            ],
          },
        ],
      },
    });
  });
});
