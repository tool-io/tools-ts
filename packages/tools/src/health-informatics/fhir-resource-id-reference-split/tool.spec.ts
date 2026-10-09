import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("health-informatics/fhir-resource-id-reference-split", () => {
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, outputSchema)).toBe(true);
  });
  it("reproduces its exact canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculate(example.input)).toEqual(example.output);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches an independent valid or boundary fixture", () => {
    expect(tool.execute({ reference: "Observation/o18" })).toEqual({
      ok: true,
      output: {
        resourceType: "Observation",
        resourceId: "o18",
        versionId: "",
        versioned: false,
      },
    });
  });
  it.each([
    null,
    [],
    "invalid",
    {},
    { ...example.input, unexpected: 1 },
    ...Object.keys(example.input).map((key) => ({
      ...example.input,
      [key]: null,
    })),
  ])("rejects malformed or missing input %j", (input) => {
    const r = tool.execute(input);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.code).toBe("invalid_input");
      expect(r.error.issues[0].code).toBe("invalid_field");
    }
  });
});

describe("batch 77 reviewed regressions", () => {
  it.each([
    "https://example.test/Patient/p17",
    "#p17",
    "Patient/",
    "Patient/p17/extra",
    "Patient/p17/_history/",
    "Patient/p17\n",
    "Patient/" + "x".repeat(65),
  ])(
    "rejects a reference outside the stated relative-reference grammar %j",
    (reference) => {
      expect(tool.execute({ reference })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "reference", code: "invalid_domain" }] },
      });
    },
  );
  it("preserves case and a literal version identifier", () => {
    expect(calculate({ reference: "Observation/A.b-2/_history/V3" })).toEqual({
      resourceType: "Observation",
      resourceId: "A.b-2",
      versionId: "V3",
      versioned: true,
    });
  });
});
