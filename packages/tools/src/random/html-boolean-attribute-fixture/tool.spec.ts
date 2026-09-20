import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateHtmlBooleanAttributeFixture,
  runHtmlBooleanAttributeFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateHtmlBooleanAttributeFixture, example);
    expect(runHtmlBooleanAttributeFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(
      tool.execute({ ...example.input, attributes: ["aria-hidden"] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "attributes", code: "invalid_field" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    expect(
      tool.execute({ ...example.input, variants: ["false"], count: 1 }),
    ).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            tag: '<button disabled="false">',
            present: true,
            interpreted: true,
            spellingConforming: false,
          },
        ],
      },
    });
    expect(
      tool.execute({ ...example.input, variants: ["absent"], count: 1 }),
    ).toMatchObject({
      ok: true,
      output: {
        cases: [
          { present: false, interpreted: false, spellingConforming: true },
        ],
      },
    });
  });
});
