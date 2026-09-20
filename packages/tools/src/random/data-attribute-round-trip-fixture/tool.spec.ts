import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateDataAttributeRoundTripFixture,
  runDataAttributeRoundTripFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateDataAttributeRoundTripFixture, example);
    expect(runDataAttributeRoundTripFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(
      tool.execute({ ...example.input, suffixes: ["id\n"] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "suffixes", code: "invalid_field" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    expect(
      tool.execute({
        ...example.input,
        suffixes: ["long-key"],
        values: ['x"y'],
        uppercaseControl: false,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            originalValue: 'x"y',
            encodedValue: "x&quot;y",
            parsedValue: "x&quot;y",
            sourceCheck: { valid: true, datasetKey: "longKey" },
            parsedCheck: { valid: true, datasetKey: "longKey" },
          },
        ],
      },
    });
  });
});
