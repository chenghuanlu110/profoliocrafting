import type { CodeLanguage } from "@/content/schema";

/**
 * Minimal, dependency-free highlighter for short excerpts (HDL, MATLAB,
 * Python, C). Runs at render time on the server or client; no runtime cost
 * beyond a single regex pass. Swap for Shiki in Phase 2 if richer grammars
 * are needed.
 */

const KEYWORDS: Record<CodeLanguage, string[]> = {
  verilog: ["module", "endmodule", "input", "output", "inout", "wire", "reg", "assign", "always", "posedge", "negedge", "begin", "end", "if", "else", "case", "endcase", "parameter", "localparam", "integer", "initial", "for", "generate", "endgenerate"],
  systemverilog: ["module", "endmodule", "input", "output", "inout", "logic", "wire", "assign", "always_ff", "always_comb", "always_latch", "posedge", "negedge", "begin", "end", "if", "else", "case", "unique", "priority", "endcase", "parameter", "localparam", "typedef", "enum", "struct", "packed", "interface", "endinterface", "function", "endfunction", "task", "endtask", "class", "endclass", "initial", "for", "foreach", "int", "bit"],
  matlab: ["function", "end", "if", "else", "elseif", "for", "while", "return", "switch", "case", "otherwise", "break", "continue"],
  python: ["def", "return", "if", "elif", "else", "for", "while", "import", "from", "as", "class", "with", "in", "not", "and", "or", "None", "True", "False", "lambda", "yield", "try", "except"],
  c: ["int", "char", "void", "return", "if", "else", "for", "while", "struct", "typedef", "const", "static", "unsigned", "include", "define", "uint8_t", "uint32_t"],
  text: [],
};

function commentPattern(lang: CodeLanguage) {
  if (lang === "matlab") return String.raw`%.*$`;
  if (lang === "python") return String.raw`#.*$`;
  return String.raw`\/\/.*$|\/\*[\s\S]*?\*\/`;
}

function highlight(code: string, lang: CodeLanguage) {
  if (lang === "text") return [code];
  const kw = new Set(KEYWORDS[lang]);
  const re = new RegExp(
    `(${commentPattern(lang)})|("(?:[^"\\\\]|\\\\.)*")|(\\b\\d+'[sS]?[bBdDhHoO][0-9a-fA-FxXzZ_]+|\\b\\d+(?:\\.\\d+)?(?:e-?\\d+)?\\b)|([A-Za-z_$][\\w$]*)`,
    "gm",
  );
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index));
    const [tok, comment, str, num, word] = m;
    let cls = "";
    if (comment) cls = "text-subtle italic";
    else if (str) cls = "text-[#ffd27a]";
    else if (num) cls = "text-jade/90";
    else if (word && kw.has(word)) cls = "text-ocean";
    out.push(cls ? <span key={k++} className={cls}>{tok}</span> : tok);
    last = m.index + tok.length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

const LANG_LABEL: Record<CodeLanguage, string> = {
  verilog: "Verilog",
  systemverilog: "SystemVerilog",
  matlab: "MATLAB",
  python: "Python",
  c: "C",
  text: "Text",
};

export function CodeBlock({ code, language, caption }: { code: string; language: CodeLanguage; caption?: string }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-ink-950/80">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">{LANG_LABEL[language]}</span>
        <span aria-hidden className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/10" />
          <span className="h-2 w-2 rounded-full bg-white/10" />
          <span className="h-2 w-2 rounded-full bg-white/10" />
        </span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-fg/90" tabIndex={0}>
        <code>{highlight(code, language)}</code>
      </pre>
      {caption && <figcaption className="border-t border-line px-4 py-2.5 text-[13px] text-subtle">{caption}</figcaption>}
    </figure>
  );
}
