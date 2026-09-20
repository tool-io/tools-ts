import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateProgressMeterBoundaryFixture,
  runProgressMeterBoundaryFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateProgressMeterBoundaryFixture, example);
    expect(runProgressMeterBoundaryFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(
      tool.execute({
        ...example.input,
        meter: { ...example.input.meter, low: 90 },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "meter", code: "invalid_bounds" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    expect(tool.execute({ ...example.input, modes: ["valid"] })).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            progressResult: { percent: 37.5 },
            meterResult: {
              effectiveValue: 90,
              effectiveOptimum: 10,
              band: "least-good",
            },
            meterError: null,
          },
        ],
      },
    });
    expect(
      tool.execute({ ...example.input, modes: ["indeterminate"] }),
    ).toMatchObject({
      ok: true,
      output: {
        cases: [{ progressResult: { indeterminate: true, percent: 0 } }],
      },
    });
  });
});
