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
  nSample,
  nGroups,
  nDistinct,
  nTick,
  nWork,
  nRun,
  simpleError,
  type NSeed,
  type NReplay,
  type ToolExecutionContext,
  type ToolResult,
  type ToolExample,
} from "../m500b-narrative-support.js";
type RehearsalLine = {
  readonly id: string;
  readonly speaker: string;
  readonly text: string;
};
export type RehearsalLineCueOmissionInput = NSeed & {
  readonly lines: readonly RehearsalLine[];
  readonly omissionCount: number;
  readonly contextLines: number;
};
export type RehearsalLineCueOmissionOutput = NReplay & {
  readonly studentScript: readonly (RehearsalLine & {
    readonly omitted: boolean;
  })[];
  readonly answerScript: readonly RehearsalLine[];
  readonly omissions: readonly {
    readonly lineId: string;
    readonly answer: string;
    readonly precedingContext: readonly RehearsalLine[];
  }[];
  readonly rehearsalGroups: readonly (readonly string[])[];
};
const line = nObject({ id: nId, speaker: nText, text: nText });
export const inputSchema = nInput({
  lines: nArray(line, 64, 2),
  omissionCount: nInt(1, 32),
  contextLines: nInt(1, 8),
});
export const outputSchema = nOutput({
  studentScript: nArray(
    nObject({
      id: nId,
      speaker: nText,
      text: nText,
      omitted: { type: "boolean" },
    }),
    64,
    2,
  ),
  answerScript: nArray(line, 64, 2),
  omissions: nArray(
    nObject({
      lineId: nId,
      answer: nText,
      precedingContext: nArray(line, 8, 1),
    }),
    32,
    1,
  ),
  rehearsalGroups: nArray(nArray(nId, 4, 1), 8, 1),
});
const isInput = (v: unknown): v is RehearsalLineCueOmissionInput =>
  matchesModelInput(v, inputSchema);
export const calculateRehearsalLineCueOmission = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<RehearsalLineCueOmissionOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    nDistinct(
      x.lines.map((l) => l.id),
      "lines",
    );
    nWork(x.omissionCount * x.contextLines, "contextLines", 256);
    const choices = x.lines.map((_, i) => i).slice(1),
      selected: number[] = [],
      tick = nTick();
    const search = (): boolean => {
      tick();
      if (selected.length === x.omissionCount) return true;
      const eligible = choices.filter((i) =>
        selected.every((j) => Math.abs(i - j) > x.contextLines),
      );
      for (const i of nSample(eligible, eligible.length, r)) {
        selected.push(i);
        if (search()) return true;
        selected.pop();
      }
      return false;
    };
    if (!search())
      return simpleError(
        "omissionCount",
        "Requested omissions cannot retain their preceding context.",
        "infeasible_omissions",
      );
    const omissions = selected
      .sort((a, b) => a - b)
      .map((i) => {
        const l = x.lines[i];
        if (!l) throw new Error("missing line");
        return {
          lineId: l.id,
          answer: l.text,
          precedingContext: x.lines
            .slice(Math.max(0, i - x.contextLines), i)
            .map((p) => ({ ...p })),
        };
      });
    return {
      studentScript: x.lines.map((l, i) => ({
        ...l,
        text: selected.includes(i) ? "[omitted]" : l.text,
        omitted: selected.includes(i),
      })),
      answerScript: x.lines.map((l) => ({ ...l })),
      omissions,
      rehearsalGroups: nGroups(
        omissions.map((o) => o.lineId),
        4,
      ),
    };
  });
export const rehearsalLineCueOmissionExample = {
  input: {
    lines: [
      { id: "a", speaker: "Mara", text: "Look." },
      { id: "b", speaker: "Ivo", text: "Where?" },
      { id: "c", speaker: "Mara", text: "There." },
    ],
    omissionCount: 1,
    contextLines: 1,
    seed: 42,
  },
  output: {
    studentScript: [
      { id: "a", speaker: "Mara", text: "Look.", omitted: false },
      { id: "b", speaker: "Ivo", text: "Where?", omitted: false },
      { id: "c", speaker: "Mara", text: "[omitted]", omitted: true },
    ],
    answerScript: [
      { id: "a", speaker: "Mara", text: "Look." },
      { id: "b", speaker: "Ivo", text: "Where?" },
      { id: "c", speaker: "Mara", text: "There." },
    ],
    omissions: [
      {
        lineId: "c",
        answer: "There.",
        precedingContext: [{ id: "b", speaker: "Ivo", text: "Where?" }],
      },
    ],
    rehearsalGroups: [["c"]],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  RehearsalLineCueOmissionInput,
  RehearsalLineCueOmissionOutput
>;
export const rehearsalLineCueOmissionTool = createModelDefinition<
  RehearsalLineCueOmissionInput,
  RehearsalLineCueOmissionOutput
>({
  id: "random/rehearsal-line-cue-omission",
  title: "Random Rehearsal Line Cue Omission Packet Generator",
  description:
    "Hide selected supplied cue lines while retaining their immediate preceding context, a complete answer script, and bounded rehearsal groups.",
  inputSchema,
  outputSchema,
  execute: calculateRehearsalLineCueOmission,
});
export const runRehearsalLineCueOmission = rehearsalLineCueOmissionTool.execute;
export default rehearsalLineCueOmissionTool;
