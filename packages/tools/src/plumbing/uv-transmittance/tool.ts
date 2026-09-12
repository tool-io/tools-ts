import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualBlankCorrectedTransmittedUvIntensity: number;
  readonly actualBlankCorrectedIncidentUvIntensity: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualBlankCorrectedTransmittedUvIntensity",
    label: "Actual blank corrected transmitted uv intensity",
    kind: "number",
  },
  {
    id: "actualBlankCorrectedIncidentUvIntensity",
    label: "Actual blank corrected incident uv intensity",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualBlankCorrectedTransmittedUvIntensity,
    "actualBlankCorrectedTransmittedUvIntensity",
  );
  positive(
    input.actualBlankCorrectedIncidentUvIntensity,
    "actualBlankCorrectedIncidentUvIntensity",
  );
  if (
    input.actualBlankCorrectedTransmittedUvIntensity >
    input.actualBlankCorrectedIncidentUvIntensity
  )
    simpleError("UV", "Transmission≤incidentinmatchedblankcorrectedbranch.");
  return {
    value:
      (100 * input.actualBlankCorrectedTransmittedUvIntensity) /
      input.actualBlankCorrectedIncidentUvIntensity,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualBlankCorrectedTransmittedUvIntensity: 5,
    actualBlankCorrectedIncidentUvIntensity: 10,
  },
  output: { result: { value: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/uv-transmittance",
  title: "Plumbing Uv Transmittance Calculator",
  description:
    "Actual percent UV transmittance at independently matched wavelength/path length, not absorbance or safe UV dose. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
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
