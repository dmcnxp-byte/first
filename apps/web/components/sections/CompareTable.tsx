import { Container } from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/SectionHead";

// Generic N-column data table — DOC/COMPONENT_ARCHITECTURE.md § 3's
// `CompareTable` contract. A real semantic `<table>` with `scope`
// attributes (not a CSS-grid div-table, per the accessibility contract),
// with a CSS-only stacked-card view below the `tc` (660px) breakpoint —
// implemented as two parallel renders toggled by Tailwind's responsive
// display utilities rather than `data-label`/`content: attr()` tricks.
export function CompareTable({
  eyebrow,
  heading,
  headingAccent,
  columns,
  rows,
}: {
  eyebrow?: string;
  heading: string;
  headingAccent?: string;
  columns: string[];
  rows: { _key: string; label: string; values: string[] }[];
}) {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <SectionHead eyebrow={eyebrow} heading={heading} headingAccent={headingAccent} />

        <div className="border-hairline tc:block hidden overflow-x-auto rounded-xl border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-navy text-white">
                <th scope="col" className="p-4 text-left" />
                {columns.map((col) => (
                  <th
                    key={col}
                    scope="col"
                    className="font-display p-4 text-left font-semibold"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row._key} className="border-hairline border-t">
                  <th
                    scope="row"
                    className="border-hairline text-slate border-r bg-[#FBFAF6] p-4 text-left font-medium"
                  >
                    {row.label}
                  </th>
                  {row.values.map((value, i) => (
                    <td
                      key={i}
                      className="border-hairline text-navy border-r p-4 font-semibold last:border-r-0"
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="tc:hidden flex flex-col gap-4">
          {rows.map((row) => (
            <div
              key={row._key}
              className="border-hairline rounded-xl border bg-white p-4"
            >
              <p className="text-navy font-display mb-3 font-semibold">{row.label}</p>
              <dl className="flex flex-col gap-2 text-sm">
                {row.values.map((value, i) => (
                  <div key={i} className="flex items-baseline justify-between gap-3">
                    <dt className="text-slate">{columns[i]}</dt>
                    <dd className="text-navy text-right font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
