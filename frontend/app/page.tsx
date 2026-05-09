import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-4xl space-y-12">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Phase 3 — Design System Preview
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Research Assistant
          </h1>
          <p className="text-lg text-muted-foreground">
            Apple-inspired UI for the Hybrid RAG arXiv system
          </p>
        </div>

        <Separator />

        {/* ── Color palette ───────────────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Color Palette</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Background", cls: "bg-background border" },
              { label: "Card", cls: "bg-card border" },
              { label: "Primary (Blue)", cls: "bg-primary" },
              { label: "Secondary", cls: "bg-secondary" },
              { label: "Muted", cls: "bg-muted" },
              { label: "Destructive", cls: "bg-destructive" },
              { label: "Success", style: { background: "var(--apple-green)" } },
              { label: "Warning", style: { background: "var(--apple-yellow)" } },
            ].map(({ label, cls, style }) => (
              <div key={label} className="space-y-1.5">
                <div
                  className={`h-12 rounded-xl ${cls ?? ""}`}
                  style={style}
                />
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Typography ──────────────────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Typography</h2>
          <Card>
            <CardContent className="pt-6 space-y-3">
              <p className="text-4xl font-bold tracking-tight">Display — 36px Bold</p>
              <p className="text-2xl font-semibold">Title — 24px Semibold</p>
              <p className="text-lg font-medium">Headline — 18px Medium</p>
              <p className="text-base">Body — 16px Regular. The transformer model uses self-attention to relate positions of a sequence. [Document 1]</p>
              <p className="text-sm text-muted-foreground">Caption — 14px Muted. arXiv:0705.2011 · cs.LG, cs.AI</p>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Label — 12px Uppercase Tracked</p>
            </CardContent>
          </Card>
        </section>

        {/* ── Components ──────────────────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Components</h2>
          <div className="grid gap-6 sm:grid-cols-2">

            {/* Buttons */}
            <Card>
              <CardHeader><CardTitle className="text-base">Buttons</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button>Submit Query</Button>
                <Button variant="secondary">Sample Question</Button>
                <Button variant="outline">View Source</Button>
                <Button variant="destructive">Error State</Button>
                <Button disabled>Loading…</Button>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card>
              <CardHeader><CardTitle className="text-base">Badges & Tags</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge>cs.LG</Badge>
                <Badge variant="secondary">cs.AI</Badge>
                <Badge variant="outline">arXiv:0705.2011</Badge>
                <Badge
                  className="text-white"
                  style={{ background: "var(--apple-green)" }}
                >
                  PASS
                </Badge>
                <Badge
                  className="text-white"
                  style={{ background: "var(--apple-red)" }}
                >
                  FAIL
                </Badge>
                <Badge variant="secondary">Rank #1</Badge>
                <Badge variant="outline">Score: 0.94</Badge>
              </CardContent>
            </Card>

            {/* Card with glass utility */}
            <Card className="card-apple">
              <CardHeader>
                <CardTitle className="text-base">Answer Card (hover me)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Multi-dimensional recurrent neural networks extend standard RNNs to
                  operate over multi-dimensional data [Document 1]. They process
                  sequences along multiple axes simultaneously [Document 2].
                </p>
              </CardContent>
            </Card>

            {/* Skeleton loading state */}
            <Card>
              <CardHeader><CardTitle className="text-base">Loading Skeleton</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ── Glass panel demo ────────────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Glass Effect (Sidebar / NavBar)</h2>
          <div
            className="glass rounded-2xl p-6"
          >
            <p className="font-semibold text-foreground mb-1">Settings Panel</p>
            <p className="text-sm text-muted-foreground">
              This glass panel will be used for the sidebar and navbar — frosted
              backdrop-blur with semi-transparent background.
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}
