import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateAccordionContentFixture,
  runAccordionContentFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateAccordionContentFixture, example);
    expect(runAccordionContentFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(tool.execute({ ...example.input, previewLimit: -1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "previewLimit", code: "invalid_field" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    expect(
      tool.execute(
        {
          sections: [{ heading: "Moon", body: "A🌙BCD" }],
          count: 1,
          expandedProbability: 1,
          previewLimit: 3,
        },
        { random: () => 0 },
      ),
    ).toMatchObject({
      ok: true,
      output: {
        sections: [
          { preview: "A🌙…", expanded: true, lengthClass: "over-limit" },
        ],
      },
    });
    expect(
      tool.execute(
        {
          sections: [{ heading: "Empty", body: "" }],
          count: 1,
          expandedProbability: 0,
          previewLimit: 0,
        },
        { random: () => 0 },
      ),
    ).toMatchObject({
      ok: true,
      output: {
        sections: [{ preview: "", expanded: false, lengthClass: "empty" }],
      },
    });
  });
});
