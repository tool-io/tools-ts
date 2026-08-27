import { describe, expect, it } from "vitest";
import {
  runStratalTerminationTypeLookup,
  stratalTerminationTypeLookupExample,
} from "./tool.js";

describe("stratal-termination-type-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runStratalTerminationTypeLookup(
        stratalTerminationTypeLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: stratalTerminationTypeLookupExample.output,
    });
  });

  it("classifies truncation as an erosional top termination", () => {
    const result = runStratalTerminationTypeLookup({
      termination: "truncation",
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.contact as string).toBe("top");
    expect(result.output.terminationClass as string).toBe(
      "erosional termination",
    );
  });

  it("rejects unknown terminations", () => {
    expect(runStratalTerminationTypeLookup({ termination: "offlap" }).ok).toBe(
      false,
    );
  });
});
