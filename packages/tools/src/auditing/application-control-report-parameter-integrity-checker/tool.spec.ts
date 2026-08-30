import { describe, expect, it } from "vitest";
import {
  checkReportParameterIntegrity,
  reportParameterIntegrityExample,
  runReportParameterIntegrity,
} from "./tool.js";

describe("application control report parameter integrity", () => {
  it("reproduces its canonical example", () => {
    expect(
      runReportParameterIntegrity(reportParameterIntegrityExample.input),
    ).toEqual({
      ok: true,
      output: reportParameterIntegrityExample.output,
    });
  });

  it("reports unsupported actual parameters", () => {
    expect(
      checkReportParameterIntegrity({
        actualParameters: ["entity", "debug"],
        requiredParameters: ["entity"],
        supportedParameters: ["entity"],
      }),
    ).toMatchObject({ complete: false, unexpectedParameters: ["debug"] });
  });

  it("accepts exact required and supported sets", () => {
    expect(
      checkReportParameterIntegrity({
        actualParameters: ["ENTITY"],
        requiredParameters: ["entity"],
        supportedParameters: ["Entity"],
      }).complete,
    ).toBe(true);
  });

  it("rejects an empty supported-parameter definition", () => {
    expect(
      runReportParameterIntegrity({
        actualParameters: [],
        requiredParameters: [],
        supportedParameters: [],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "supported_parameters_required" }] },
      ok: false,
    });
  });
});
