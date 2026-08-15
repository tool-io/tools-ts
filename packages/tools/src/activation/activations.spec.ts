import { describe, expect, it } from "vitest";
import { validateToolContract } from "../core/contract.js";

const tools = {
  "activation/relu": await import("./relu/tool.js"),
  "activation/leaky-relu": await import("./leaky-relu/tool.js"),
  "activation/sigmoid": await import("./sigmoid/tool.js"),
  "activation/tanh": await import("./tanh/tool.js"),
  "activation/softplus": await import("./softplus/tool.js"),
  "activation/softmax": await import("./softmax/tool.js"),
} as const;

describe("Activation family", () => {
  for (const [id, module] of Object.entries(tools)) {
    it(`${id} publishes a valid contract and executes its example`, () => {
      const tool = module.default;
      expect(tool.id).toBe(id);
      expect(validateToolContract(tool)).toEqual([]);
      const result = tool.execute(module.example.input);
      expect(result).toEqual({ ok: true, output: module.example.output });
    });
  }

  it("keeps relu and leaky-relu exact on both branches", () => {
    expect(tools["activation/relu"].default.execute({ x: -7.5 })).toEqual({
      ok: true,
      output: { y: 0 },
    });
    const leaky = tools["activation/leaky-relu"].default.execute({
      alpha: 0.1,
      x: -3,
    });
    expect(leaky.ok).toBe(true);
    if (leaky.ok) expect(leaky.output.y).toBeCloseTo(-0.3, 14);
  });

  it("bounds sigmoid and tanh outputs", () => {
    for (const id of ["activation/sigmoid", "activation/tanh"] as const) {
      const high = tools[id].default.execute({ x: 100 }) as unknown as {
        output: { y: number };
      };
      expect(high.output.y).toBeLessThanOrEqual(1);
    }
  });

  it("produces a softmax distribution summing to one", () => {
    const result = tools["activation/softmax"].default.execute({
      values: [10, 20, 30],
    }) as unknown as { output: { probabilities: number[] } };
    const total = result.output.probabilities.reduce((a, b) => a + b, 0);
    expect(Math.round(total * 100) / 100).toBe(1);
  });
});
