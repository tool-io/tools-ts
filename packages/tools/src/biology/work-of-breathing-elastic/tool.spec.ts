import { describe, expect, it } from "vitest";
import {
  runWorkOfBreathingElastic,
  workOfBreathingElasticExample,
} from "./tool.js";

describe("Elastic WOB", () => {
  it("publishes an executable example", () =>
    expect(
      runWorkOfBreathingElastic(workOfBreathingElasticExample.input),
    ).toEqual({ ok: true, output: workOfBreathingElasticExample.output }));
  it("quadruples when tidal volume doubles", () =>
    expect(
      runWorkOfBreathingElastic({
        elastanceCmh2oPerL: 10,
        tidalVolumeLiters: 1,
      }),
    ).toEqual({
      ok: true,
      output: { elasticWorkJoules: 0.49050000000000005 },
    }));
  it("doubles when elastance doubles", () =>
    expect(
      runWorkOfBreathingElastic({
        elastanceCmh2oPerL: 20,
        tidalVolumeLiters: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { elasticWorkJoules: 0.24525000000000002 },
    }));
  it("keeps small fractional results", () =>
    expect(
      runWorkOfBreathingElastic({
        elastanceCmh2oPerL: 5,
        tidalVolumeLiters: 0.4,
      }),
    ).toEqual({
      ok: true,
      output: { elasticWorkJoules: 0.03924000000000001 },
    }));
  it("rejects zero elastance", () =>
    expect(
      runWorkOfBreathingElastic({
        elastanceCmh2oPerL: 0,
        tidalVolumeLiters: 0.5,
      }).ok,
    ).toBe(false));
  it("rejects zero tidal volume", () =>
    expect(
      runWorkOfBreathingElastic({
        elastanceCmh2oPerL: 10,
        tidalVolumeLiters: 0,
      }).ok,
    ).toBe(false));
  it("rejects negative inputs", () =>
    expect(
      runWorkOfBreathingElastic({
        elastanceCmh2oPerL: -10,
        tidalVolumeLiters: 0.5,
      }).ok,
    ).toBe(false));
});
