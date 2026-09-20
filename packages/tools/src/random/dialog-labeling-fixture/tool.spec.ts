import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateDialogLabelingFixture,
  runDialogLabelingFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateDialogLabelingFixture, example);
    expect(runDialogLabelingFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(tool.execute({ ...example.input, modes: [] })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "modes", code: "invalid_field" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    expect(
      tool.execute({ ...example.input, modes: ["missing-title"] }),
    ).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            titleReference: {
              bound: false,
              targetIndex: -1,
              duplicateId: false,
            },
            descriptionReference: {
              bound: true,
              targetIndex: 0,
              duplicateId: false,
            },
          },
        ],
      },
    });
  });
});
