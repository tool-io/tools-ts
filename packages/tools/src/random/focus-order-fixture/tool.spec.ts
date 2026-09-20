import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateFocusOrderFixture,
  runFocusOrderFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateFocusOrderFixture, example);
    expect(runFocusOrderFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(
      tool.execute({
        ...example.input,
        controls: [{ id: "x", label: "X", tabindex: 0.5, hidden: false }],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "controls", code: "invalid_field" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    const result = tool.execute({
      ...example.input,
      controls: [
        { id: "first", label: "First", tabindex: 3, hidden: false },
        { id: "hidden", label: "Hidden", tabindex: 1, hidden: true },
        { id: "second", label: "Second", tabindex: 3, hidden: false },
      ],
    });
    if (!result.ok) throw new Error("Expected focus model");
    expect(result.output.expectedOrder).toEqual(
      result.output.controls.filter((c) => !c.hidden).map((c) => c.id),
    );
  });
});
