import { expect, it } from "vitest";
import tool, {
  calculateComicPanelStoryboard,
  comicPanelStoryboardExample as example,
} from "./tool.js";
import { fictionCraftContractTests } from "../m250-fiction-craft-testing.js";
fictionCraftContractTests(tool, calculateComicPanelStoryboard, example);
it("independently checks continuity and exact text sums", () => {
  const r = tool.execute(example.input);
  if (!r.ok) throw new Error("Expected storyboard");
  let state = "quay";
  for (const p of r.output.panels) {
    expect(p.from).toBe(state);
    expect(p.textLength).toBe(
      p.scene.length + p.action.length + p.dialogue.length,
    );
    expect(p.textLength).toBeLessThanOrEqual(25);
    state = p.to;
  }
  expect(state).toBe("home");
});
it("rejects text infeasibility, unreachable endings and resource bounds", () => {
  for (const change of [{ textLimit: 24 }, { endState: "moon" }])
    expect(tool.execute({ ...example.input, ...change })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "infeasible_storyboard" }] },
    });
  expect(tool.execute({ ...example.input, count: 33 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "count" }] },
  });
});
