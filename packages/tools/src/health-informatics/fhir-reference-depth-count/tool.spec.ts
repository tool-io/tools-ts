import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("health-informatics/fhir-reference-depth-count", () => {
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
    expect(tool.execute({ reference: "#contained" })).toEqual({
      ok: true,
      output: {
        pathSegments: 0,
        fragmentPresent: true,
        historyVersionPresent: false,
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

describe("independently reviewed regressions", () => {
  it("absolute FHIR references ignore the authority and query", () => {
    const output = calculate({
      reference: "https://example.org/fhir/Patient/123/_history/2?x=1#part",
    });
    expect(output).toMatchObject({
      pathSegments: 5,
      fragmentPresent: true,
      historyVersionPresent: true,
    });
    expect(
      tool.execute({
        reference: "https://example.org/fhir/Patient/123/_history/2?x=1#part",
      }),
    ).toEqual({ ok: true, output });
  });
});
