import { describe, expect, it } from "vitest";
import {
  runWellLogPorosityNeutron,
  wellLogPorosityNeutronExample,
} from "./tool.js";

describe("well-log-porosity-neutron", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runWellLogPorosityNeutron(wellLogPorosityNeutronExample.input),
    ).toEqual({
      ok: true,
      output: wellLogPorosityNeutronExample.output,
    });
  });

  it("passes the raw reading through without shale", () => {
    const result = runWellLogPorosityNeutron({ neutronLogFraction: 0.31 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.correctedPorosity as number).toBe(0.31);
  });

  it("rejects negative log readings", () => {
    expect(runWellLogPorosityNeutron({ neutronLogFraction: -0.05 }).ok).toBe(
      false,
    );
  });
});
