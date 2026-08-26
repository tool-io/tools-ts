import { describe, expect, it } from "vitest";
import {
  mutationRatePerGenerationExample,
  runMutationRatePerGeneration,
} from "./tool.js";

describe("Mutation Rate", () => {
  it("publishes an executable example", () =>
    expect(
      runMutationRatePerGeneration(mutationRatePerGenerationExample.input),
    ).toEqual({
      ok: true,
      output: mutationRatePerGenerationExample.output,
    }));
  it("divides mutations by population size times generations", () =>
    expect(
      runMutationRatePerGeneration({
        generationsInt: 10,
        newMutationsCount: 3,
        populationSizeInt: 500,
      }),
    ).toEqual({ ok: true, output: { mutationRatePerGeneration: 0.0006 } }));
  it("yields zero with no new mutations", () =>
    expect(
      runMutationRatePerGeneration({
        generationsInt: 100,
        newMutationsCount: 0,
        populationSizeInt: 10000,
      }),
    ).toEqual({ ok: true, output: { mutationRatePerGeneration: 0 } }));
  it("rejects zero population size", () =>
    expect(
      runMutationRatePerGeneration({
        generationsInt: 100,
        newMutationsCount: 5,
        populationSizeInt: 0,
      }).ok,
    ).toBe(false));
  it("rejects zero generations", () =>
    expect(
      runMutationRatePerGeneration({
        generationsInt: 0,
        newMutationsCount: 5,
        populationSizeInt: 10000,
      }).ok,
    ).toBe(false));
  it("rejects non-integer population size", () =>
    expect(
      runMutationRatePerGeneration({
        generationsInt: 100,
        newMutationsCount: 5,
        populationSizeInt: 10.5,
      }).ok,
    ).toBe(false));
  it("rejects negative mutation counts", () =>
    expect(
      runMutationRatePerGeneration({
        generationsInt: 100,
        newMutationsCount: -1,
        populationSizeInt: 10000,
      }).ok,
    ).toBe(false));
  it("rejects missing inputs", () =>
    expect(runMutationRatePerGeneration({ newMutationsCount: 5 }).ok).toBe(
      false,
    ));
});
