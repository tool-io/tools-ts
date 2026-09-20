import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateCustomElementNameFixture,
  runCustomElementNameFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateCustomElementNameFixture, example);
    expect(runCustomElementNameFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(
      tool.execute({
        ...example.input,
        prefixes: ["font"],
        suffixes: ["face"],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "prefixes", code: "invalid_baseline_name" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    expect(
      tool.execute({
        ...example.input,
        prefixes: ["weather"],
        suffixes: ["panel"],
        modes: ["uppercase"],
      }),
    ).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            original: "weather-panel",
            name: "WEATHER-panel",
            check: { valid: false, containsDash: true, reserved: false },
          },
        ],
      },
    });
    expect(
      tool.execute({ ...example.input, modes: ["remove-dash"] }),
    ).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            name: "newspanel",
            check: { valid: false, containsDash: false, reserved: false },
          },
        ],
      },
    });
  });
});
