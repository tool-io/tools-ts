import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateAriaStateTransitionFixture,
  runAriaStateTransitionFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateAriaStateTransitionFixture, example);
    expect(runAriaStateTransitionFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(
      tool.execute({ ...example.input, values: ["false", "yes"] }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "transitions", code: "invalid_state_reference" }],
      },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    expect(tool.execute({ ...example.input, transitions: [] })).toMatchObject({
      ok: true,
      output: {
        events: [
          { accepted: false, value: "false" },
          { accepted: false, value: "false" },
        ],
        finalValue: "false",
      },
    });
    expect(
      tool.execute({ ...example.input, attribute: "aria-invented" }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "values", code: "unsupported_state_token" }] },
    });
  });
});
