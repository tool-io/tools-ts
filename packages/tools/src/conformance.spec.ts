import { describe, expect, it } from "vitest";
import bodyMassIndexFixture from "../../../fixtures/conformance/body-mass-index.json" with { type: "json" };
import medianFixture from "../../../fixtures/conformance/median.json" with { type: "json" };
import numericDatasetFixture from "../../../fixtures/conformance/numeric-dataset.json" with { type: "json" };
import { toolRegistry } from "./registry.js";

type Expected =
  | { readonly absoluteTolerance?: number; readonly ok: true; readonly output: unknown }
  | { readonly errorCode: string; readonly issueCodes?: readonly string[]; readonly ok: false };
type Fixture = {
  readonly cases: readonly {
    readonly expected: Expected;
    readonly input: unknown;
    readonly name: string;
  }[];
  readonly schemaVersion: 1;
  readonly tool: { readonly contractVersion: number; readonly id: string };
};

const expectPortableValue = (
  actual: unknown,
  expected: unknown,
  tolerance: number,
): void => {
  if (typeof expected === "number" && typeof actual === "number") {
    expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);
    return;
  }
  if (Array.isArray(expected)) {
    expect(Array.isArray(actual)).toBe(true);
    expected.forEach((value, index) =>
      expectPortableValue((actual as readonly unknown[])[index], value, tolerance),
    );
    return;
  }
  if (typeof expected === "object" && expected !== null) {
    expect(typeof actual).toBe("object");
    for (const [key, value] of Object.entries(expected))
      expectPortableValue((actual as Record<string, unknown>)[key], value, tolerance);
    return;
  }
  expect(actual).toEqual(expected);
};

const fixtures: readonly Fixture[] = [
  bodyMassIndexFixture as unknown as Fixture,
  medianFixture as unknown as Fixture,
  numericDatasetFixture as unknown as Fixture,
];

describe("portable conformance fixtures", () => {
  for (const fixture of fixtures) {
    for (const testCase of fixture.cases) {
      it(`${fixture.tool.id}: ${testCase.name}`, () => {
        const tool = toolRegistry.get(fixture.tool.id);
        expect(tool?.contractVersion).toBe(fixture.tool.contractVersion);
        const result = tool!.execute(testCase.input);
        expect(result.ok).toBe(testCase.expected.ok);
        if (testCase.expected.ok) {
          if (!result.ok) throw new Error("Expected tool execution to succeed.");
          expectPortableValue(
            result.output,
            testCase.expected.output,
            testCase.expected.absoluteTolerance ?? 0,
          );
        } else {
          if (result.ok) throw new Error("Expected tool execution to fail.");
          expect(result.error.code).toBe(testCase.expected.errorCode);
          if (testCase.expected.issueCodes)
            expect(result.error.issues.map(({ code }) => code)).toEqual(
              expect.arrayContaining([...testCase.expected.issueCodes]),
            );
        }
      });
    }
  }
});
