import { describe, expect, it } from "vitest";
import tool, {
  calculateEpistolaryStoryPacket,
  epistolaryStoryPacketExample as example,
} from "./tool.js";
import { snAuthoringSpecs } from "../m250-sampling-narrative-spec-support.js";

describe(tool.id, () => {
  snAuthoringSpecs(tool, calculateEpistolaryStoryPacket, example);
  it("independently reconstructs reply continuity, day arithmetic, and reveal dependencies", () => {
    const events = [
      { id: "arrive", text: "I arrived.", requires: [] },
      { id: "find", text: "I found the key.", requires: ["arrive"] },
      { id: "unlock", text: "The door opened.", requires: ["find"] },
    ];
    const result = tool.execute({
      ...example.input,
      events,
      count: 3,
      startDay: -4,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.revealOrder).toEqual(["arrive", "find", "unlock"]);
    let previousDay = -4;
    for (let i = 0; i < result.output.letters.length; i += 1) {
      const letter = result.output.letters[i];
      expect(letter.sentDay).toBe(previousDay);
      expect(letter.receivedDay - letter.sentDay).toBe(letter.delayDays);
      expect(letter.delayDays >= 1 && letter.delayDays <= 2).toBe(true);
      expect(letter.knownEventsBefore).toEqual(
        result.output.revealOrder.slice(0, i),
      );
      if (i) {
        expect(letter.reply.to).toBe(result.output.letters[i - 1].id);
        expect(letter.senderId).toBe(result.output.letters[i - 1].recipientId);
        expect(letter.recipientId).toBe(result.output.letters[i - 1].senderId);
      } else expect(letter.reply.to).toBeNull();
      previousDay = letter.receivedDay;
    }
  });
  it("delegates greedy wrapping while keeping supplied long words and literal replacement braces", () => {
    const result = tool.execute({
      ...example.input,
      people: [
        { id: "m", name: "Mara {value}" },
        { id: "i", name: "Ivo" },
      ],
      events: [
        { id: "notice", text: "Extraordinary signal arrived.", requires: [] },
      ],
      count: 1,
      wrapWidth: 6,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.letters[0].text).toContain(
      "Extraordinary\nsignal\narrived.",
    );
    expect(result.output.letters[0].text).toContain("{value},");
    expect(result.output.letters[0].lineCount).toBe(
      result.output.letters[0].text.split("\n").length,
    );
  });
  it("preserves input-order tie breaking for zero-day delivery", () => {
    const result = tool.execute({
      ...example.input,
      delays: [
        { id: "instant", minimumDays: 0, maximumDays: 0, text: "Delivered." },
      ],
    });
    expect(result).toMatchObject({
      ok: true,
      output: {
        letters: [
          { sentDay: 10, receivedDay: 10 },
          { sentDay: 10, receivedDay: 10 },
        ],
        deliveryOrder: ["letter-1", "letter-2"],
      },
    });
  });
  it("rejects unknown/cyclic reveal dependencies and impossible event counts", () => {
    expect(
      tool.execute({
        ...example.input,
        events: [{ id: "a", text: "A.", requires: ["missing"] }],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "count", code: "infeasible_event_count" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        count: 1,
        events: [{ id: "a", text: "A.", requires: ["missing"] }],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "events", code: "unknown_prerequisite" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        events: [
          { id: "a", text: "A.", requires: ["b"] },
          { id: "b", text: "B.", requires: ["a"] },
        ],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "events", code: "cyclic_prerequisites" }] },
    });
  });
  it("rejects unsupported placeholders, reversed delays and unsafe relative-day ranges", () => {
    expect(
      tool.execute({ ...example.input, openingTemplates: ["{unsupported}"] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "templates", code: "invalid_template" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        delays: [{ id: "bad", minimumDays: 3, maximumDays: 2, text: "Wait." }],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "delays", code: "invalid_delay_range" }] },
    });
    expect(
      tool.execute({ ...example.input, startDay: Number.MAX_SAFE_INTEGER }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "delays", code: "unsafe_day_range" }] },
    });
    expect(tool.execute({ ...example.input, count: 33 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "count", code: "invalid_field" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        people: [example.input.people[0], example.input.people[0]],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "people", code: "duplicate_id" }] },
    });
  });
});
