import {
  runFictionalInterviewTranscript as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateFictionalInterviewTranscript as calculate,
  fictionalInterviewTranscriptExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent no-interruption fact substitution", () => {
  const result = calculate({ ...example.input, interruptions: [], count: 1 });
  if (!result.ok) throw new Error("success");
  expect(result.output.turns.map((t) => t.body.text)).toEqual([
    "Lamp?",
    "It is blue.",
  ]);
});
it("lightweight malformed tokens and fact references", () => {
  expect(
    calculate({
      ...example.input,
      pairs: [
        { id: "x", factId: "gate", question: "{missing}", answer: "{value}" },
      ],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "pairs", code: "invalid_token" }] },
  });
  expect(
    calculate({
      ...example.input,
      pairs: [
        { id: "x", factId: "absent", question: "Why?", answer: "{value}" },
      ],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "pairs", code: "invalid_reference" }] },
  });
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
