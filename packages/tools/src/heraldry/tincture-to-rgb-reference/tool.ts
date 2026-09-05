import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  unique,
  aligned,
  shape,
  bounded,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly callerVerifiedPaletteId: string;
  readonly callerVerifiedTinctureNames: readonly string[];
  readonly callerVerifiedSrgbByteTriples: readonly (readonly number[])[];
  readonly queryTincture: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedPaletteId",
    label: "Verified palette/edition",
    kind: "string",
  },
  {
    id: "callerVerifiedTinctureNames",
    label: "Verified tincture names",
    kind: "stringList",
  },
  {
    id: "callerVerifiedSrgbByteTriples",
    label: "Verified sRGB byte triples",
    kind: "matrix",
  },
  { id: "queryTincture", label: "Query tincture", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.callerVerifiedPaletteId.trim())
    simpleError(
      "palette",
      "Independently verified palette/edition ID required.",
    );
  unique(input.callerVerifiedTinctureNames, "tinctures");
  aligned(
    input.callerVerifiedTinctureNames,
    input.callerVerifiedSrgbByteTriples,
    "palette",
  );
  if (shape(input.callerVerifiedSrgbByteTriples, "RGB") !== 3)
    simpleError("RGB", "Exactly three sRGB bytes per tincture.");
  input.callerVerifiedSrgbByteTriples.forEach((row) =>
    row.forEach((v) => bounded(v, "byte", 0, 255)),
  );
  const index = input.callerVerifiedTinctureNames.indexOf(input.queryTincture);
  if (index < 0)
    simpleError("tincture", "Unknown independently verified palette tincture.");
  return {
    paletteId: input.callerVerifiedPaletteId,
    srgbBytes: [...input.callerVerifiedSrgbByteTriples[index]],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedPaletteId: "caller-illustrative-palette",
    callerVerifiedTinctureNames: ["gules", "azure"],
    callerVerifiedSrgbByteTriples: [
      [200, 0, 0],
      [0, 0, 200],
    ],
    queryTincture: "gules",
  },
  output: {
    result: {
      paletteId: "caller-illustrative-palette",
      srgbBytes: [200, 0, 0],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/tincture-to-rgb-reference",
  title: "Tincture to Modern RGB Reference Converter",
  description:
    "Convert a tincture to a numeric sRGB byte triple from an independently verified caller palette/edition. Validate every palette entry including unqueried rows, retain palette identity, reject unknown tinctures and fractional bytes. No universal heraldic colour, live chart, print-profile conversion or authoritative palette fabricated; example is an illustrative caller palette.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
