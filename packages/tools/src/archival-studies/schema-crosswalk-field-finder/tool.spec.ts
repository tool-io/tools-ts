import { describe, expect, it } from "vitest";
import {
  calculateSchemaCrosswalkFieldFinder,
  runSchemaCrosswalkFieldFinder,
  schemaCrosswalkFieldFinderExample,
} from "./tool.js";

describe("archival-studies/schema-crosswalk-field-finder", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSchemaCrosswalkFieldFinder(schemaCrosswalkFieldFinderExample.input),
    ).toEqual({ ok: true, output: schemaCrosswalkFieldFinderExample.output });
  });

  it("crosswalks descriptive and access fields consistently", () => {
    expect(
      calculateSchemaCrosswalkFieldFinder({ dublinCoreField: "title" }),
    ).toEqual({
      eadElement: "unittitle",
      dcTermUri: "http://purl.org/dc/elements/1.1/title",
    });
    expect(
      calculateSchemaCrosswalkFieldFinder({ dublinCoreField: "rights" }),
    ).toMatchObject({ eadElement: "accessrestrict" });
  });

  it("rejects unknown Dublin Core elements at the tool boundary", () => {
    expect(
      runSchemaCrosswalkFieldFinder({
        dublinCoreField: "abstract",
      } as never).ok,
    ).toBe(false);
  });
});
