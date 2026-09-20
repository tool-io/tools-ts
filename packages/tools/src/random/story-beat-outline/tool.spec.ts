import { expect, it } from "vitest";
import tool, {
  calculateStoryBeatOutline,
  storyBeatOutlineExample as example,
} from "./tool.js";
import { fictionCraftContractTests } from "../m250-fiction-craft-testing.js";
fictionCraftContractTests(tool, calculateStoryBeatOutline, example);
it("independently replays supplied tag transitions", () => {
  const r = tool.execute(example.input);
  if (!r.ok) throw new Error("Expected outline");
  let state: string[] = [];
  for (const beat of r.output.beats) {
    expect(beat.tagsBefore).toEqual(state);
    const t = example.input.templates.find((v) => v.id === beat.templateId);
    if (!t) throw new Error("Unknown template");
    expect(t.requires.every((tag) => state.includes(tag))).toBe(true);
    state = [
      ...state.filter((tag) => !t.removes.some((v) => v === tag)),
      ...t.adds,
    ].sort();
    expect(beat.tagsAfter).toEqual(state);
  }
});
it("rejects unavailable resolution and resource overflow", () => {
  expect(
    tool.execute({
      ...example.input,
      templates: example.input.templates.slice(0, 2),
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "infeasible_continuity", field: "templates" }] },
  });
  expect(tool.execute({ ...example.input, count: 33 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "count" }] },
  });
  expect(
    tool.execute({ ...example.input, initialTags: ["x", "x"] }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "duplicate_identity" }] },
  });
});
it("bounds expanded prose before publishing a schema-incompatible beat", () => {
  expect(
    tool.execute({
      ...example.input,
      genre: "g".repeat(2048),
      templates: example.input.templates.map((t) => ({
        ...t,
        text: "{genre}".repeat(100),
      })),
    }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ code: "resource_limit_exceeded", field: "templates" }],
    },
  });
});
