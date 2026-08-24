import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LanguageCode6392ValidatorInput = {
  readonly code: string;
};

export type LanguageCode6392ValidatorOutput = {
  readonly isValid: boolean;
  readonly normalizedCode: string;
};

const ASSIGNED_ISO_639_2_CODES = new Set(
  "aar abk ace ach ada ady afa afh afr ain aka akk alb ale alg alt amh ang anp apa ara arc arg arm arn arp art arw asm ast ath aus ava ave awa aym aze bad bai bak bal bam ban baq bas bat bej bel bem ben ber bho bih bik bin bis bla bnt bod bos bra bre btk bua bug bul bur byn cad cai car cat cau ceb cel ces cha chb che chg chi chk chm chn cho chp chr chu chv chy cmc cnr cop cor cos cpe cpf cpp cre crh crp csb cus cym cze dak dan dar day del den deu dgr din div doi dra dsb dua dum dut dyu dzo efi egy eka ell elx eng enm epo est eus ewe ewo fan fao fas fat fij fil fin fiu fon fra fre frm fro frr frs fry ful fur gaa gay gba gem geo ger gez gil gla gle glg glv gmh goh gon gor got grb grc gre grn gsw guj gwi hai hat hau haw heb her hil him hin hit hmn hmo hrv hsb hun hup hye iba ibo ice ido iii ijo iku ile ilo ina inc ind ine inh ipk ira iro isl ita jav jbo jpn jpr jrb kaa kab kac kal kam kan kar kas kat kau kaw kaz kbd kha khi khm kho kik kin kir kmb kok kom kon kor kos kpe krc krl kro kru kua kum kur kut lad lah lam lao lat lav lez lim lin lit lol loz ltz lua lub lug lui lun luo lus mac mad mag mah mai mak mal man mao map mar mas may mdf mdr men mga mic min mis mkd mkh mlg mlt mnc mni mno moh mon mos mri msa mul mun mus mwl mwr mya myn myv nah nai nap nau nav nbl nde ndo nds nep new nia nic niu nld nno nob nog non nor nqo nso nub nwc nya nym nyn nyo nzi oci oji ori orm osa oss ota oto paa pag pal pam pan pap pau peo per phi phn pli pol pon por pra pro pus que raj rap rar roa roh rom ron rum run rup rus sad sag sah sai sal sam san sas sat scn sco sel sem sga sgn shn sid sin sio sit sla slk slo slv sma sme smi smj smn smo sms sna snd snk sog som son sot spa sqi srd srn srp srr ssa ssw suk sun sus sux swa swe syc syr tah tai tam tat tel tem ter tet tgk tgl tha tib tig tir tiv tkl tlh tli tmh tog ton tpi tsi tsn tso tuk tum tup tur tut tvl twi tyv udm uga uig ukr umb und urd uzb vai ven vie vol vot wak wal war was wel wen wln wol xal xho yao yap yid yor ypk zap zbl zen zgh zha zho znd zul zun zxx zza".split(
    " ",
  ),
);

export const calculateLanguageCode6392Validator = (
  input: LanguageCode6392ValidatorInput,
): LanguageCode6392ValidatorOutput => {
  if (typeof input.code !== "string")
    simpleError("code", "Code must be a string.", "invalid_code");
  if (input.code.trim().length === 0)
    simpleError("code", "Code must not be empty.", "invalid_code");
  const normalizedCode = input.code.trim().toLowerCase();
  return {
    isValid:
      ASSIGNED_ISO_639_2_CODES.has(normalizedCode) ||
      (normalizedCode >= "qaa" && normalizedCode <= "qtz"),
    normalizedCode,
  };
};

export const languageCode6392ValidatorExample = {
  input: { code: " ENG " },
  output: { isValid: true, normalizedCode: "eng" },
} satisfies ToolExample<
  LanguageCode6392ValidatorInput,
  LanguageCode6392ValidatorOutput
>;

export const languageCode6392ValidatorTool = createSimpleTool({
  id: "archival-studies/language-code-6392-validator",
  title: "Language Code ISO 639-2 Three-Letter Validator",
  description:
    "Validate assigned ISO 639-2 bibliographic and terminology codes, plus the qaa–qtz locally reserved range, and return the lowercase normalized form.",
  inputs: [
    {
      description: "Candidate three-letter language code.",
      id: "code",
      kind: "string",
      label: "Code",
    },
  ],
  outputs: [
    {
      description:
        "True for an assigned ISO 639-2 code or a code in the qaa–qtz local-use range.",
      id: "isValid",
      kind: "boolean",
      label: "Valid",
    },
    {
      description: "Trimmed lowercase form of the code.",
      id: "normalizedCode",
      kind: "string",
      label: "Normalized",
    },
  ],
  calculate: (input) =>
    calculateLanguageCode6392Validator({
      code: input.code as string,
    }),
});

export const runLanguageCode6392Validator =
  languageCode6392ValidatorTool.execute;
export default languageCode6392ValidatorTool;
