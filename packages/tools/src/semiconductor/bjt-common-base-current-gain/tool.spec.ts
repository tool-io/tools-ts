import { describe, expect, it } from "vitest";
import {
  commonBaseCurrentGainExample,
  calculateCommonBaseCurrentGain,
  runCommonBaseCurrentGain,
} from "./tool.js";

describe("bjt common-base current gain calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCommonBaseCurrentGain(commonBaseCurrentGainExample.input)).toEqual({
      ok: true,
      output: commonBaseCurrentGainExample.output,
    });
  });

  it("equals the product of the two factors", async () => {
    const { calculateBaseTransportFactor } = await import("../bjt-base-transport-factor/tool.js");
    const { calculateEmitterEfficiency } = await import("../bjt-emitter-efficiency/tool.js");
    const input = commonBaseCurrentGainExample.input;
    const transport = calculateBaseTransportFactor({ baseWidthUm: input.baseWidthUm, baseDiffusionLengthUm: input.baseDiffusionLengthUm }).alphaT;
    const efficiency = calculateEmitterEfficiency({
      baseDopingPerCm3: input.baseDopingPerCm3, baseWidthUm: input.baseWidthUm,
      emitterDiffusionLengthUm: input.emitterDiffusionLengthUm, emitterDopingPerCm3: input.emitterDopingPerCm3,
    }).gamma;
    const alpha = calculateCommonBaseCurrentGain(input).alpha;
    expect(alpha).toBeCloseTo(transport * efficiency, 12);
  });

  it("rejects a base wider than the diffusion length through execution", () => {
    expect(runCommonBaseCurrentGain({
      baseDiffusionLengthUm: 0.2, baseDopingPerCm3: 1e16, baseWidthUm: 0.5,
      emitterDiffusionLengthUm: 2, emitterDopingPerCm3: 1e19,
    })).toMatchObject({ error: { issues: [{ code: "transport_invalid" }] }, ok: false });
  });
});
