"use client";

import { useState } from "react";
import { mockIndustries } from "@/../mocks/industries";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function IndustryStepPage() {
  const router = useRouter();
  const [selected, setSelected] = useState("manufacturing");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-text-primary">Select Your Industry Vertical</h2>
        <p className="text-sm text-text-secondary mt-1">
          Loom adapts account structures, tax categories, and default workflows based on your primary business model.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockIndustries.map((ind) => {
          const isSelected = selected === ind.id;
          return (
            <Card
              key={ind.id}
              onClick={() => setSelected(ind.id)}
              className={`cursor-pointer transition-all duration-200 select-none ${
                isSelected
                  ? "border-accent ring-2 ring-accent/30 bg-surface-1 shadow-md"
                  : "border-border-subtle bg-surface-1/60 hover:bg-surface-hover hover:border-border-strong"
              }`}
            >
              <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-base">{ind.name}</CardTitle>
                    {ind.recommended && <Badge variant="accent">Recommended</Badge>}
                  </div>
                  <CardDescription className="text-xs leading-relaxed">{ind.description}</CardDescription>
                </div>
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isSelected ? "bg-accent border-accent text-on-accent" : "border-border-strong bg-surface-2"
                  }`}
                >
                  {isSelected && <Check size={12} strokeWidth={3} />}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ind.defaultModules.map((m) => (
                    <span
                      key={m}
                      className="rounded bg-surface-2 px-2 py-0.5 text-[10px] font-mono uppercase text-text-secondary border border-border-subtle"
                    >
                      +{m}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-border-subtle">
        <span className="text-xs text-text-tertiary">Step 1 of 8</span>
        <Button variant="accent" onClick={() => router.push("/onboarding/company")}>
          Continue to Company Profile
          <ArrowRight size={15} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
