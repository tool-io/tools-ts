import { describe, expect, it } from "vitest";
import {
  deacidificationCarbonateDoseExample,
  deacidificationCarbonateDoseTool,
  runDeacidificationCarbonateDose,
} from "./tool.js";

describe("deacidificationCarbonateDoseTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runDeacidificationCarbonateDose(
        deacidificationCarbonateDoseExample.input,
      ),
    ).toEqual({
      ok: true,
      output: deacidificationCarbonateDoseExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(deacidificationCarbonateDoseExample)),
    ).toEqual(deacidificationCarbonateDoseExample);
    expect(deacidificationCarbonateDoseTool.contractVersion).toBe(1);
    expect(deacidificationCarbonateDoseTool.execution).toEqual({
      kind: "pure",
    });
  });

  it("returns structured errors for malformed input", () => {
    expect(runDeacidificationCarbonateDose(null).ok).toBe(false);
    expect(
      runDeacidificationCarbonateDose({
        ...deacidificationCarbonateDoseExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
