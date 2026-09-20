import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateLabelBindingMutationCorpus,
  runLabelBindingMutationCorpus,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateLabelBindingMutationCorpus, example);
    expect(runLabelBindingMutationCorpus(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(
      tool.execute({ ...example.input, modes: ["missing", "missing"] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "modes", code: "duplicate_entries" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    expect(
      tool.execute({
        ...example.input,
        fields: [{ id: "x", label: "X & Y" }],
        modes: ["duplicate"],
      }),
    ).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            html: '<label for="x">X &amp; Y</label><span id="x"></span><input id="x">',
            binding: { bound: false, targetIndex: 0, duplicateId: true },
          },
        ],
      },
    });
  });
});
