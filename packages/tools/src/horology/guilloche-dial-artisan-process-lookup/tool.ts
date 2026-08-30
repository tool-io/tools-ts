import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const processEntries = {
  blankPreparation: {
    keyDate: "before engraving",
    statement:
      "The metal blank must be prepared flat, clean, and dimensionally stable; pattern centering and cut depth depend on the blank and machine setup.",
  },
  commissioning: {
    keyDate: "commission stage",
    statement:
      "A commission should define motif, dial dimensions, material, hand-guided versus machine execution, acceptable tolerance, finish, reference to the rose or straight-line engine, and ownership of the pattern.",
  },
  finishing: {
    keyDate: "after engraving",
    statement:
      "After engine turning, the engraved surface must be cleaned and finished so the pattern reads clearly without erasing the cut or changing the intended optical effect.",
  },
  machineSetup: {
    keyDate: "machine stage",
    statement:
      "Rose and straight-line engines use cams or rosettes and coordinated crank movement to guide the cutter; a motif is not transferable to another engine without redesign.",
  },
  qualityEvidence: {
    keyDate: "acceptance stage",
    statement:
      "Acceptance evidence should include flatness, centering, continuity and depth of cuts, surface finish, registration of printing or enamel work, and inspection under agreed lighting.",
  },
} as const;

export type GuillocheProcessFocus = keyof typeof processEntries;

export type GuillocheProcessLookupInput = {
  readonly processFocus: GuillocheProcessFocus;
};

export type GuillocheProcessLookupOutput = {
  readonly keyDate: string;
  readonly processFocus: GuillocheProcessFocus;
  readonly processStage: string;
};

export const lookupGuillocheDialCommissionProcess = (
  input: GuillocheProcessLookupInput,
): GuillocheProcessLookupOutput => {
  const entry = processEntries[input.processFocus];
  if (entry === undefined)
    simpleError(
      "processFocus",
      "Guilloché process focus is not supported.",
      "unsupported_process_focus",
    );
  return {
    keyDate: entry.keyDate,
    processFocus: input.processFocus,
    processStage: entry.statement,
  };
};

export const guillocheProcessExample = {
  input: { processFocus: "commissioning" },
  output: {
    keyDate: "commission stage",
    processFocus: "commissioning",
    processStage:
      "A commission should define motif, dial dimensions, material, hand-guided versus machine execution, acceptable tolerance, finish, reference to the rose or straight-line engine, and ownership of the pattern.",
  },
} satisfies ToolExample<
  GuillocheProcessLookupInput,
  GuillocheProcessLookupOutput
>;

export const guillocheProcessTool = createSimpleTool({
  calculate: (input) =>
    lookupGuillocheDialCommissionProcess({
      processFocus: input.processFocus as GuillocheProcessFocus,
    }),
  description:
    "Return a commission, blank-preparation, machine-setup, finishing, or quality-evidence control for a hand- or machine-guided guilloché dial.",
  id: "horology/guilloche-dial-artisan-process-lookup",
  inputs: [
    {
      enum: [
        "commissioning",
        "blankPreparation",
        "machineSetup",
        "finishing",
        "qualityEvidence",
      ],
      id: "processFocus",
      kind: "string",
      label: "Guilloché dial artisan process focus",
    },
  ],
  outputs: [
    { id: "keyDate", kind: "string", label: "Process stage" },
    {
      id: "processFocus",
      kind: "string",
      label: "Guilloché dial artisan process focus",
    },
    { id: "processStage", kind: "string", label: "Artisan process control" },
  ],
  title: "Guilloché Dial Artisan Process Lookup",
});

export const runGuillocheProcess = guillocheProcessTool.execute;
export default guillocheProcessTool;
