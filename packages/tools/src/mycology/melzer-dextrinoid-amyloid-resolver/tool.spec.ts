import { describe, expect, it } from "vitest";
import {
  melzerDextrinoidAmyloidResolverExample,
  melzerDextrinoidAmyloidResolverTool,
  runMelzerDextrinoidAmyloidResolver,
} from "./tool.js";

describe("melzerDextrinoidAmyloidResolverTool", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMelzerDextrinoidAmyloidResolver(
        melzerDextrinoidAmyloidResolverExample.input,
      ),
    ).toEqual({
      ok: true,
      output: melzerDextrinoidAmyloidResolverExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(melzerDextrinoidAmyloidResolverExample)),
    ).toEqual(melzerDextrinoidAmyloidResolverExample);
    expect(melzerDextrinoidAmyloidResolverTool.contractVersion).toBe(1);
    expect(melzerDextrinoidAmyloidResolverTool.execution).toEqual({
      kind: "pure",
    });
  });

  it("resolves the blue-black reaction to amyloid", () => {
    const r = runMelzerDextrinoidAmyloidResolver({
      reaction: "amyloid-blue-black",
    });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.melzerClass).toBe("amyloid");
  });

  it("resolves the red-brown reaction to dextrinoid", () => {
    const r = runMelzerDextrinoidAmyloidResolver({
      reaction: "dextrinoid-red-brown",
    });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.melzerClass).toBe("dextrinoid");
  });

  it("resolves the no-change reaction to inamyloid", () => {
    const r = runMelzerDextrinoidAmyloidResolver({
      reaction: "inamyloid-no-change",
    });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.melzerClass).toBe("inamyloid");
  });

  it("rejects unknown reactions", () => {
    expect(
      runMelzerDextrinoidAmyloidResolver({ reaction: "pseudoamyloid" }).ok,
    ).toBe(false);
    expect(runMelzerDextrinoidAmyloidResolver({ reaction: "" }).ok).toBe(false);
  });

  it("rejects malformed input", () => {
    expect(runMelzerDextrinoidAmyloidResolver(null).ok).toBe(false);
    expect(runMelzerDextrinoidAmyloidResolver({ reaction: true }).ok).toBe(
      false,
    );
    expect(
      runMelzerDextrinoidAmyloidResolver({
        ...melzerDextrinoidAmyloidResolverExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
