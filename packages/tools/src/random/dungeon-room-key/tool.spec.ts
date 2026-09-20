import { expect, it } from "vitest";
import tool, {
  calculateDungeonRoomKey,
  dungeonRoomKeyExample as example,
} from "./tool.js";
import { fictionCraftContractTests } from "../m250-fiction-craft-testing.js";
fictionCraftContractTests(tool, calculateDungeonRoomKey, example);
it("places keys before locks using an independent flood fill", () => {
  const r = tool.execute(example.input);
  if (!r.ok) throw new Error("Expected dungeon");
  const keys = new Set<string>(),
    reached = new Set<string>([example.input.startRoomId]);
  for (const stage of r.output.stages) {
    if (stage.keyId !== null) {
      expect(reached.has(stage.keyRoomId ?? "")).toBe(true);
      keys.add(stage.keyId);
    }
    for (let pass = 0; pass < 3; pass++)
      for (const d of example.input.doors)
        if (d.keyId === null || keys.has(d.keyId)) {
          if (reached.has(d.from)) reached.add(d.to);
          if (reached.has(d.to)) reached.add(d.from);
        }
    expect([...reached].sort()).toEqual(stage.reachableRooms);
  }
});
it("reports dangling references, disconnected requirements and resource bounds", () => {
  expect(tool.execute({ ...example.input, keyIds: [] })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_reference" }] },
  });
  expect(tool.execute({ ...example.input, doors: [] })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "unreachable_room" }] },
  });
  expect(
    tool.execute({
      ...example.input,
      rooms: Array(25).fill({ id: "r", name: "Room" }),
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "rooms" }] },
  });
});
