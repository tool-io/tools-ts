import { describe, expect, it } from "vitest";
import {
  executeTool,
  getToolContract,
  getToolExample,
  loadTool,
} from "./runtime.js";

describe("lazy tool runtime", () => {
  it("deduplicates concurrent loads of the same tool module", async () => {
    const [first, second] = await Promise.all([
      loadTool("body-mass-index"),
      loadTool("body-mass-index"),
    ]);
    expect(first).toBe(second);
  });

  it("loads and executes one tool by stable ID", async () => {
    const tool = await loadTool("body-mass-index");
    expect(tool?.id).toBe("body-mass-index");
    await expect(
      executeTool("body-mass-index", { heightM: 1.8, weightKg: 70 }),
    ).resolves.toEqual({
      ok: true,
      output: { bmi: 21.604938271604937 },
    });
  });

  it("returns authored examples and portable contracts", async () => {
    await expect(getToolExample("body-mass-index")).resolves.toBeDefined();
    await expect(getToolContract("body-mass-index")).resolves.toMatchObject({
      contractVersion: 1,
      id: "body-mass-index",
    });
  });

  it("does not import unknown or unsafe identifiers", async () => {
    await expect(loadTool("missing/tool")).resolves.toBeUndefined();
    await expect(loadTool("../package.json")).resolves.toBeUndefined();
    await expect(executeTool("missing/tool", {})).resolves.toBeUndefined();
  });
});
