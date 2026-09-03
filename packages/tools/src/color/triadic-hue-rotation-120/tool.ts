import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, wrap } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly primaryHueDegrees: number;
  readonly callerHueDefined: boolean;
}>;
export type Output = Readonly<{
  readonly harmonyHueDegrees: readonly number[];
  readonly hueEvidenceAvailable: boolean;
}>;
const inputFields = [
  { id: "primaryHueDegrees", label: "Primary hue degrees", kind: "number" },
  { id: "callerHueDefined", label: "Caller hue defined", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.callerHueDefined)
    simpleError(
      "hue",
      "Caller chromatic hue evidence required; neutral colors have no unique hue.",
    );
  return {
    harmonyHueDegrees: [120, 240].map((o) =>
      wrap(input.primaryHueDegrees + o, 360),
    ),
    hueEvidenceAvailable: true,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  primaryHueDegrees: 350,
  callerHueDefined: true,
} satisfies Input;
export const exampleOutput = {
  harmonyHueDegrees: [110, 230],
  hueEvidenceAvailable: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/triadic-hue-rotation-120",
  title: "Triadic Hue Rotation ±120°",
  description:
    "Named Triadic angular hue-wheel construction (not RGB hue conversion, perceptual harmony or automated accent policy). Explicit declared color space/reference and caller applicability; not spectral equivalence, pigment mixing, press readiness or accessibility certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "harmonyHueDegrees",
      label: "Harmony hue degrees",
      kind: "numberList",
    },
    {
      id: "hueEvidenceAvailable",
      label: "Hue evidence available",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      primaryHueDegrees: value.primaryHueDegrees as number,
      callerHueDefined: value.callerHueDefined as boolean,
    }),
});
export const run = tool.execute;
export default tool;
