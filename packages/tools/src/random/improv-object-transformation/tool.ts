import {
  createModelDefinition,
  matchesModelInput,
  nInput,
  nOutput,
  nArray,
  nObject,
  nId,
  nText,
  nTags,
  nStringList,
  nInt,
  nPick,
  nSample,
  nGroups,
  nDistinct,
  nRun,
  simpleError,
  type NSeed,
  type NReplay,
  type ToolExecutionContext,
  type ToolResult,
  type ToolExample,
} from "../m500b-narrative-support.js";
export type ImprovObjectTransformationInput = NSeed & {
  readonly participants: readonly string[];
  readonly interpretations: readonly {
    readonly id: string;
    readonly label: string;
    readonly themeTags: readonly string[];
  }[];
  readonly excludedThemes: readonly string[];
  readonly transitionPrompts: readonly string[];
  readonly turnCount: number;
};
export type ImprovObjectTransformationOutput = NReplay & {
  readonly participantCycle: readonly string[];
  readonly turns: readonly {
    readonly turn: number;
    readonly participantId: string;
    readonly interpretationId: string;
    readonly interpretation: string;
    readonly themeTags: readonly string[];
    readonly previousInterpretationId: string | null;
    readonly transitionPrompt: string | null;
    readonly receivedFrom: string | null;
    readonly handoffTo: string | null;
  }[];
  readonly rounds: readonly (readonly number[])[];
  readonly scope: string;
};
export const inputSchema = nInput({
  participants: nArray(nId, 16, 1),
  interpretations: nArray(
    nObject({ id: nId, label: nText, themeTags: nTags }),
    16,
    1,
  ),
  excludedThemes: nTags,
  transitionPrompts: nStringList,
  turnCount: nInt(1, 32),
});
export const outputSchema = nOutput({
  participantCycle: nArray(nId, 16, 1),
  turns: nArray(
    nObject({
      turn: nInt(1, 32),
      participantId: nId,
      interpretationId: nId,
      interpretation: nText,
      themeTags: nTags,
      previousInterpretationId: { anyOf: [nId, { type: "null" }] },
      transitionPrompt: { anyOf: [nText, { type: "null" }] },
      receivedFrom: { anyOf: [nId, { type: "null" }] },
      handoffTo: { anyOf: [nId, { type: "null" }] },
    }),
    32,
    1,
  ),
  rounds: nArray(nArray(nInt(1, 32), 16, 1), 32, 1),
  scope: {
    type: "string",
    const:
      "imaginary-object interpretations only; no real equipment manipulation",
  },
});
const isInput = (v: unknown): v is ImprovObjectTransformationInput =>
  matchesModelInput(v, inputSchema);
export const calculateImprovObjectTransformation = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ImprovObjectTransformationOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    nDistinct(x.participants, "participants");
    nDistinct(
      x.interpretations.map((i) => i.id),
      "interpretations",
    );
    nDistinct(x.excludedThemes, "excludedThemes");
    for (const i of x.interpretations)
      nDistinct(i.themeTags, "interpretations.themeTags");
    const eligible = x.interpretations.filter(
      (i) => !i.themeTags.some((t) => x.excludedThemes.includes(t)),
    );
    if (eligible.length < (x.turnCount > 1 ? 2 : 1))
      return simpleError(
        "excludedThemes",
        "Exclusions leave insufficient distinct imaginary interpretations for a changing relay.",
        "infeasible_transformations",
      );
    const participantCycle = nSample(x.participants, x.participants.length, r);
    let previousInterpretationId: string | null = null;
    const turns = Array.from({ length: x.turnCount }, (_, i) => {
      const interpretation = nPick(
          eligible.filter((e) => e.id !== previousInterpretationId),
          r,
        ),
        before = previousInterpretationId;
      previousInterpretationId = interpretation.id;
      const participantId = participantCycle[i % participantCycle.length];
      if (participantId === undefined) throw new Error("missing participant");
      return {
        turn: i + 1,
        participantId,
        interpretationId: interpretation.id,
        interpretation: interpretation.label,
        themeTags: [...interpretation.themeTags],
        previousInterpretationId: before,
        transitionPrompt: i ? nPick(x.transitionPrompts, r) : null,
        receivedFrom: i
          ? (participantCycle[(i - 1) % participantCycle.length] ?? null)
          : null,
        handoffTo:
          i + 1 < x.turnCount
            ? (participantCycle[(i + 1) % participantCycle.length] ?? null)
            : null,
      };
    });
    return {
      participantCycle,
      turns,
      rounds: nGroups(
        turns.map((t) => t.turn),
        x.participants.length,
      ),
      scope:
        "imaginary-object interpretations only; no real equipment manipulation",
    };
  });
export const improvObjectTransformationExample = {
  input: {
    participants: ["a", "b"],
    interpretations: [
      { id: "moon", label: "Imaginary moon", themeTags: ["sky"] },
      { id: "boat", label: "Imaginary boat", themeTags: ["sea"] },
    ],
    excludedThemes: [],
    transitionPrompts: ["Change shape"],
    turnCount: 2,
    seed: 42,
  },
  output: {
    participantCycle: ["b", "a"],
    turns: [
      {
        turn: 1,
        participantId: "b",
        interpretationId: "boat",
        interpretation: "Imaginary boat",
        themeTags: ["sea"],
        previousInterpretationId: null,
        transitionPrompt: null,
        receivedFrom: null,
        handoffTo: "a",
      },
      {
        turn: 2,
        participantId: "a",
        interpretationId: "moon",
        interpretation: "Imaginary moon",
        themeTags: ["sky"],
        previousInterpretationId: "boat",
        transitionPrompt: "Change shape",
        receivedFrom: "b",
        handoffTo: null,
      },
    ],
    rounds: [[1, 2]],
    scope:
      "imaginary-object interpretations only; no real equipment manipulation",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  ImprovObjectTransformationInput,
  ImprovObjectTransformationOutput
>;
export const improvObjectTransformationTool = createModelDefinition<
  ImprovObjectTransformationInput,
  ImprovObjectTransformationOutput
>({
  id: "random/improv-object-transformation",
  title: "Random Improv Object Transformation Relay Generator",
  description:
    "Assign supplied imaginary-object interpretations to participant turns with theme exclusions, changing interpretations, transition prompts, and complete handoffs.",
  inputSchema,
  outputSchema,
  execute: calculateImprovObjectTransformation,
});
export const runImprovObjectTransformation =
  improvObjectTransformationTool.execute;
export default improvObjectTransformationTool;
