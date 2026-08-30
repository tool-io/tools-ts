import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const epilameEntries = {
  cleaning: {
    keyDate: "official preparation requirement",
    statement:
      "Moebius requires parts to be cleaned and dried before Fixodrop treatment; contamination and preparation strongly affect the resulting epilame film.",
  },
  filmRole: {
    keyDate: "surface treatment",
    statement:
      "Epilame is a surface treatment used to limit lubricant spreading; it is not the lubricant that supplies the hydrodynamic or boundary oil film at a bearing.",
  },
  materialSelection: {
    keyDate: "product-specific",
    statement:
      "Moebius offers standard-material and precious or special-material Fixodrop families, including versions described for steel, ruby, copper, gold, rhodium, nickel, and DLC.",
  },
  product8981: {
    keyDate: "current Moebius listing",
    statement:
      "Moebius lists ready-to-use Fixodrop BS-10 8981 as resistant to several washes and suitable for production or after-sales service on all material types.",
  },
  restriction: {
    keyDate: "caliber-specific",
    statement:
      "Epilame use is a lubricant-system decision. Apply it only where the manufacturer or equipment process specifies the exact part, preparation, film, and subsequent lubrication sequence.",
  },
} as const;

export type FixodropFocus = keyof typeof epilameEntries;

export type FixodropLookupInput = {
  readonly treatmentFocus: FixodropFocus;
};

export type FixodropLookupOutput = {
  readonly keyDate: string;
  readonly treatmentFocus: FixodropFocus;
  readonly verifiedStatement: string;
};

export const lookupFixodropEpilameTreatment = (
  input: FixodropLookupInput,
): FixodropLookupOutput => {
  const entry = epilameEntries[input.treatmentFocus];
  if (entry === undefined)
    simpleError(
      "treatmentFocus",
      "Epilame treatment focus is not supported.",
      "unsupported_treatment_focus",
    );
  return {
    keyDate: entry.keyDate,
    treatmentFocus: input.treatmentFocus,
    verifiedStatement: entry.statement,
  };
};

export const fixodropExample = {
  input: { treatmentFocus: "filmRole" },
  output: {
    keyDate: "surface treatment",
    treatmentFocus: "filmRole",
    verifiedStatement:
      "Epilame is a surface treatment used to limit lubricant spreading; it is not the lubricant that supplies the hydrodynamic or boundary oil film at a bearing.",
  },
} satisfies ToolExample<FixodropLookupInput, FixodropLookupOutput>;

export const fixodropTool = createSimpleTool({
  calculate: (input) =>
    lookupFixodropEpilameTreatment({
      treatmentFocus: input.treatmentFocus as FixodropFocus,
    }),
  description:
    "Return Moebius Fixodrop 8981 preparation, material, film-role, or application-restriction facts without treating epilame as a substitute lubricant.",
  id: "horology/fixodrop-epilame-surface-treatment-lookup",
  inputs: [
    {
      enum: [
        "filmRole",
        "product8981",
        "cleaning",
        "materialSelection",
        "restriction",
      ],
      id: "treatmentFocus",
      kind: "string",
      label: "Fixodrop epilame treatment focus",
    },
  ],
  outputs: [
    { id: "keyDate", kind: "string", label: "Product or process status" },
    {
      id: "treatmentFocus",
      kind: "string",
      label: "Fixodrop epilame treatment focus",
    },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified epilame statement",
    },
  ],
  title: "Fixodrop Epilame Surface Treatment Lookup",
});

export const runFixodrop = fixodropTool.execute;
export default fixodropTool;
