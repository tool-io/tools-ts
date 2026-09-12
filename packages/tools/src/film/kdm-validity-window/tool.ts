import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualKdmNotBeforeEpochMs: number;
  readonly actualKdmNotAfterEpochMs: number;
  readonly actualObservedPlaybackEpochMs: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualKdmNotBeforeEpochMs",
    label: "Actual kdm not before epoch ms",
    kind: "number",
  },
  {
    id: "actualKdmNotAfterEpochMs",
    label: "Actual kdm not after epoch ms",
    kind: "number",
  },
  {
    id: "actualObservedPlaybackEpochMs",
    label: "Actual observed playback epoch ms",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.actualKdmNotAfterEpochMs <= input.actualKdmNotBeforeEpochMs)
    simpleError("KDM", "Actualpositive-widthinterval.");
  return {
    withinDeclaredHalfOpenKdmInterval:
      input.actualObservedPlaybackEpochMs >= input.actualKdmNotBeforeEpochMs &&
      input.actualObservedPlaybackEpochMs < input.actualKdmNotAfterEpochMs,
    signedMillisecondsUntilEnd:
      input.actualKdmNotAfterEpochMs - input.actualObservedPlaybackEpochMs,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualKdmNotBeforeEpochMs: 0,
    actualKdmNotAfterEpochMs: 2000,
    actualObservedPlaybackEpochMs: 1000,
  },
  output: {
    result: {
      withinDeclaredHalfOpenKdmInterval: true,
      signedMillisecondsUntilEnd: 1000,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "film/kdm-validity-window",
  title: "KDM Validity Window Calculator",
  description:
    "Declared half-openKDMnotBefore\u2264t<notAftertimeauditONLY, not signature/decryption/certchain/playback authorization; not inclusiveX509validity semantics. Time zone/interval convention independently verified.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
