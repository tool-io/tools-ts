import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateFormWizardStateFixture,
  runFormWizardStateFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateFormWizardStateFixture, example);
    expect(runFormWizardStateFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(
      tool.execute({
        ...example.input,
        steps: [{ id: "bad\n", label: "Bad", optional: false }],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "steps", code: "invalid_field" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    const draws = [0, 0.3, 0.99];
    const { seed, ...input } = example.input;
    expect(
      tool.execute(input, { random: () => draws.shift() ?? 0 }),
    ).toMatchObject({
      ok: true,
      output: {
        events: [
          { action: "next", target: "review", accepted: true },
          { action: "back", target: "account", accepted: true },
          { action: "resume", target: "review", accepted: true },
        ],
        finalStep: "review",
      },
    });
  });
});
