import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateFieldsetLegendStructureFixture,
  runFieldsetLegendStructureFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateFieldsetLegendStructureFixture, example);
    expect(runFieldsetLegendStructureFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(
      tool.execute({
        ...example.input,
        count: 32,
        fieldLabels: Array(16).fill("Field"),
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "count", code: "resource_limit" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    expect(
      tool.execute({ ...example.input, modes: ["missing"] }),
    ).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            semanticKey: "contact-group",
            structure: {
              legendCount: 0,
              legendFirst: false,
              validPlacement: true,
              hasLegend: false,
            },
          },
        ],
      },
    });
  });
});
