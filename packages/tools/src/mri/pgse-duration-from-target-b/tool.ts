import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bValue,
} from "../shared.js";
export type Input = Readonly<{
  readonly targetBSecondsPerSquareMm: number;
  readonly gammaHzPerTesla: number;
  readonly gradientMilliTeslaPerMeter: number;
  readonly separationMs: number;
}>;
export type Output = Readonly<{
  readonly gradientDurationMs: number;
}>;
const inputFields = [
  {
    id: "targetBSecondsPerSquareMm",
    label: "Target b seconds per square mm",
    kind: "number",
    unit: "mm",
  },
  { id: "gammaHzPerTesla", label: "Gamma hz per tesla", kind: "number" },
  {
    id: "gradientMilliTeslaPerMeter",
    label: "Gradient milli tesla per meter",
    kind: "number",
  },
  { id: "separationMs", label: "Separation ms", kind: "number", unit: "ms" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.targetBSecondsPerSquareMm, "targetBSecondsPerSquareMm");
  positive(input.gradientMilliTeslaPerMeter, "gradientMilliTeslaPerMeter");
  positive(input.separationMs, "separationMs");
  const maximum = positive(
    bValue(
      input.gammaHzPerTesla,
      input.gradientMilliTeslaPerMeter,
      input.separationMs,
      input.separationMs,
    ),
    "model",
  );
  const tolerance = 16 * Number.EPSILON * maximum;
  if (input.targetBSecondsPerSquareMm > maximum + tolerance)
    simpleError(
      "targetBSecondsPerSquareMm",
      "Target b exceeds the nonoverlapping rectangular-pulse timing range.",
    );
  if (input.targetBSecondsPerSquareMm === 0) return { gradientDurationMs: 0 };
  if (input.targetBSecondsPerSquareMm >= maximum - tolerance)
    return { gradientDurationMs: input.separationMs };
  let low = 0,
    high = input.separationMs;
  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2;
    if (
      bValue(
        input.gammaHzPerTesla,
        input.gradientMilliTeslaPerMeter,
        mid,
        input.separationMs,
      ) < input.targetBSecondsPerSquareMm
    )
      low = mid;
    else high = mid;
  }
  return { gradientDurationMs: (low + high) / 2 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  targetBSecondsPerSquareMm: 0.01052757802782865,
  gammaHzPerTesla: 1000000,
  gradientMilliTeslaPerMeter: 10,
  separationMs: 30,
} satisfies Input;
export const exampleOutput = { gradientDurationMs: 10 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/pgse-duration-from-target-b",
  title: "Diffusion Gradient Duration",
  description:
    "Solve the monotone rectangular-PGSE timing equation for pulse duration within [0, leading-edge separation]; no hardware optimization or clinical setting is recommended.",
  inputs: inputFields,
  outputs: [
    {
      id: "gradientDurationMs",
      label: "Gradient duration ms",
      kind: "number",
      unit: "ms",
    },
  ],
  calculate: (value) =>
    calculate({
      targetBSecondsPerSquareMm: value.targetBSecondsPerSquareMm as number,
      gammaHzPerTesla: value.gammaHzPerTesla as number,
      gradientMilliTeslaPerMeter: value.gradientMilliTeslaPerMeter as number,
      separationMs: value.separationMs as number,
    }),
});
export const run = tool.execute;
export default tool;
