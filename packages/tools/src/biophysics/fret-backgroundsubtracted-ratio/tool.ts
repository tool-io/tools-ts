import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  donor: number;
  acceptor: number;
  donorBackground: number;
  acceptorBackground: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "donor", label: "Donor", kind: "number" },
  { id: "acceptor", label: "Acceptor", kind: "number" },
  { id: "donorBackground", label: "Donor background", kind: "number" },
  { id: "acceptorBackground", label: "Acceptor background", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const d = i.donor - i.donorBackground,
    a = i.acceptor - i.acceptorBackground;
  H.check(d >= 0 && a >= 0 && d + a > 0);
  return H.finish({
    correctedDonor: d,
    correctedAcceptor: a,
    acceptorFraction: a / (a + d),
  });
};
export const example = {
  input: { donor: 10, acceptor: 8, donorBackground: 2, acceptorBackground: 4 },
  output: {
    result: {
      correctedDonor: 8,
      correctedAcceptor: 4,
      acceptorFraction: 0.3333333333333333,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "biophysics/fret-backgroundsubtracted-ratio",
  title: "Biophysics: FRET Backgroundsubtracted Ratio Tool",
  description:
    "Compute a background-subtracted apparent FRET acceptor fraction only; excludes spectral bleedthrough, gamma correction, distances and efficiency calibration.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          acceptorFraction: { type: "number" },
          correctedAcceptor: { type: "number" },
          correctedDonor: { type: "number" },
        },
        required: ["acceptorFraction", "correctedAcceptor", "correctedDonor"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
