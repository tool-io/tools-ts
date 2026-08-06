import { describe, expect, it } from "vitest";
import {
  bayesianNetworkSimulatorExample,
  runBayesianNetworkSimulator,
} from "./tool.js";
describe("Bayesian network simulator", () => {
  it("publishes an executable example", () =>
    expect(
      runBayesianNetworkSimulator(bayesianNetworkSimulatorExample.input),
    ).toEqual({ ok: true, output: bayesianNetworkSimulatorExample.output }));
});
