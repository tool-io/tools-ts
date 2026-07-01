import { describe, expect, it } from "vitest";
import { calculateStochasticGradientDescentStep } from "./tool.js";
describe("SGD step", () => { it("moves opposite the gradient", () => expect(calculateStochasticGradientDescentStep({ parameter: 10, gradient: 4, learningRate: 0.25 })).toEqual({ ok: true, output: { change: -1, updatedParameter: 9 } })); it("rejects a negative learning rate", () => expect(calculateStochasticGradientDescentStep({ parameter: 1, gradient: 1, learningRate: -1 }).ok).toBe(false)); });
