import {
  createModelDefinition,
  matchesModelInput,
  nInput,
  nOutput,
  nArray,
  nObject,
  nId,
  nText,
  nInt,
  nWidth,
  nWrapped,
  nWrap,
  nPick,
  nSample,
  nDistinct,
  nExpand,
  nRun,
  simpleError,
  type NSeed,
  type NReplay,
  type NWrapped,
  type ToolExecutionContext,
  type ToolResult,
  type ToolExample,
} from "../m500b-narrative-support.js";
export type FictionalInterviewTranscriptInput = NSeed & {
  readonly facts: readonly { readonly id: string; readonly value: string }[];
  readonly pairs: readonly {
    readonly id: string;
    readonly factId: string;
    readonly question: string;
    readonly answer: string;
  }[];
  readonly interviewer: string;
  readonly guest: string;
  readonly interruptions: readonly string[];
  readonly count: number;
  readonly wrapWidth: number;
};
export type FictionalInterviewTranscriptOutput = NReplay & {
  readonly facts: readonly { readonly id: string; readonly value: string }[];
  readonly turns: readonly {
    readonly kind: "question" | "answer" | "interruption";
    readonly speaker: string;
    readonly factId: string;
    readonly body: NWrapped;
  }[];
};
const fact = nObject({ id: nId, value: nText });
export const inputSchema = nInput({
  facts: nArray(fact, 16, 1),
  pairs: nArray(
    nObject({ id: nId, factId: nId, question: nText, answer: nText }),
    16,
    1,
  ),
  interviewer: nText,
  guest: nText,
  interruptions: nArray(nText, 16),
  count: nInt(1, 16),
  wrapWidth: nWidth,
});
export const outputSchema = nOutput({
  facts: nArray(fact, 16, 1),
  turns: nArray(
    nObject({
      kind: { type: "string", enum: ["question", "answer", "interruption"] },
      speaker: nText,
      factId: nId,
      body: nWrapped,
    }),
    48,
    2,
  ),
});
const isInput = (v: unknown): v is FictionalInterviewTranscriptInput =>
  matchesModelInput(v, inputSchema);
export const calculateFictionalInterviewTranscript = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<FictionalInterviewTranscriptOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    nDistinct(
      x.facts.map((f) => f.id),
      "facts",
    );
    nDistinct(
      x.pairs.map((p) => p.id),
      "pairs",
    );
    if (x.interviewer === x.guest)
      return simpleError(
        "guest",
        "Speaker labels must differ.",
        "duplicate_speaker",
      );
    const rendered = x.pairs.map((p) => {
      const f = x.facts.find((f) => f.id === p.factId);
      if (!f)
        return simpleError(
          "pairs",
          "Each pair must reference a supplied fictional fact.",
          "invalid_reference",
        );
      if (!p.answer.includes("{value}"))
        return simpleError(
          "pairs",
          "Answers must expose the supplied fact using {value}.",
          "missing_value_token",
        );
      const values = new Map([["value", f.value]]);
      return {
        ...p,
        question: nExpand(p.question, values, "pairs"),
        answer: nExpand(p.answer, values, "pairs"),
      };
    });
    const turns: FictionalInterviewTranscriptOutput["turns"][number][] = [];
    nSample(rendered, x.count, r).forEach((p, i) => {
      turns.push(
        {
          kind: "question",
          speaker: x.interviewer,
          factId: p.factId,
          body: nWrap(p.question, x.wrapWidth),
        },
        {
          kind: "answer",
          speaker: x.guest,
          factId: p.factId,
          body: nWrap(p.answer, x.wrapWidth),
        },
      );
      if (i + 1 < x.count && x.interruptions.length)
        turns.push({
          kind: "interruption",
          speaker: x.interviewer,
          factId: p.factId,
          body: nWrap(nPick(x.interruptions, r), x.wrapWidth),
        });
    });
    return { facts: x.facts.map((f) => ({ ...f })), turns };
  });
export const fictionalInterviewTranscriptExample = {
  input: {
    facts: [
      { id: "gate", value: "open" },
      { id: "lamp", value: "blue" },
    ],
    pairs: [
      { id: "q1", factId: "gate", question: "Gate?", answer: "It is {value}." },
      { id: "q2", factId: "lamp", question: "Lamp?", answer: "It is {value}." },
    ],
    interviewer: "Host",
    guest: "Mara",
    interruptions: ["Pause."],
    count: 2,
    wrapWidth: 80,
    seed: 42,
  },
  output: {
    facts: [
      { id: "gate", value: "open" },
      { id: "lamp", value: "blue" },
    ],
    turns: [
      {
        kind: "question",
        speaker: "Host",
        factId: "lamp",
        body: { text: "Lamp?", lineCount: 1 },
      },
      {
        kind: "answer",
        speaker: "Mara",
        factId: "lamp",
        body: { text: "It is blue.", lineCount: 1 },
      },
      {
        kind: "interruption",
        speaker: "Host",
        factId: "lamp",
        body: { text: "Pause.", lineCount: 1 },
      },
      {
        kind: "question",
        speaker: "Host",
        factId: "gate",
        body: { text: "Gate?", lineCount: 1 },
      },
      {
        kind: "answer",
        speaker: "Mara",
        factId: "gate",
        body: { text: "It is open.", lineCount: 1 },
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  FictionalInterviewTranscriptInput,
  FictionalInterviewTranscriptOutput
>;
export const fictionalInterviewTranscriptTool = createModelDefinition<
  FictionalInterviewTranscriptInput,
  FictionalInterviewTranscriptOutput
>({
  id: "random/fictional-interview-transcript",
  title: "Random Fictional Interview Transcript Generator",
  description:
    "Arrange supplied question/answer templates and interruptions into labeled fictional turns using a consistent explicit fact ledger.",
  inputSchema,
  outputSchema,
  execute: calculateFictionalInterviewTranscript,
});
export const runFictionalInterviewTranscript =
  fictionalInterviewTranscriptTool.execute;
export default fictionalInterviewTranscriptTool;
