import { useEffect, useState } from "react";
import { ArrowLeft, CheckSquare, Square } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Candidate, CandidateDetails } from "@/types/candidate";
import { CandidateDetailsModal } from "@/components/CandidateDetailsModal";
import InterviewSetupModal from "@/components/InterviewSetupModal";

const ShortlistedCandidates = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const [showCandidateDetails, setShowCandidateDetails] = useState(false);
    const [selectedCandidateDetails, setSelectedCandidateDetails] =
        useState<CandidateDetails | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const [showInterviewModal, setShowInterviewModal] = useState(false);

    /* ---------------- Load candidates ---------------- */
    useEffect(() => {
        const stored = localStorage.getItem("candidates");
        if (stored) {
            setCandidates(JSON.parse(stored));
        }
    }, []);

    /* ---------------- Selection helpers ---------------- */
    const toggleSelect = (usn: string) => {
        const updated = new Set(selected);
        if (updated.has(usn)) {
            updated.delete(usn);
        } else {
            updated.add(usn);
        }
        setSelected(updated);
    };

    const selectAll = () => {
        if (selected.size === candidates.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(candidates.map(c => c.usn!).filter(Boolean)));
        }
    };

    /* ✅ Derived selected candidates (FIX) */
    const selectedCandidates = candidates.filter(
        c => c.usn && selected.has(c.usn)
    );

    /* ---------------- Candidate details ---------------- */
    const handleCandidateClick = async (candidate: Candidate) => {
        if (!candidate.usn) {
            toast({
                title: "Cannot fetch details",
                description: "Candidate USN is not available",
                variant: "destructive",
            });
            return;
        }

        setShowCandidateDetails(true);
        setIsLoadingDetails(true);
        setSelectedCandidateDetails(null);

        try {
            const response = await fetch(
                "http://localhost:8000/candidates/by-usn",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ usn: candidate.usn }),
                }
            );

            if (!response.ok) throw new Error();

            const data: CandidateDetails = await response.json();
            setSelectedCandidateDetails(data);
        } catch {
            toast({
                title: "Error",
                description: "Failed to fetch candidate details",
                variant: "destructive",
            });
            setShowCandidateDetails(false);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* ---------------- Header ---------------- */}
            <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            localStorage.clear();
                            navigate("/find-candidates");
                        }}
                        className="gap-2 bg-background/60 hover:bg-background"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>

                    <div className="hidden md:flex flex-col items-center">
                        <h1 className="text-base font-semibold text-foreground leading-none">
                            Shortlist Candidates
                        </h1>
                        <p className="text-xs text-muted-foreground mt-1">
                            Review and select candidates for interview
                        </p>
                    </div>

                    <Button
                        disabled={selectedCandidates.length === 0}
                        onClick={() => setShowInterviewModal(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
                    >
                        Shortlist for Interview
                    </Button>
                </div>
            </header>

            {/* ---------------- Main ---------------- */}
            <main className="container mx-auto px-6 py-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">Shortlist Candidates</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Click a card to view details. Use the checkbox to select.
                        </p>
                    </div>

                    <Button variant="outline" onClick={selectAll} className="gap-2">
                        {selected.size === candidates.length ? (
                            <CheckSquare className="w-4 h-4" />
                        ) : (
                            <Square className="w-4 h-4" />
                        )}
                        Select All
                    </Button>
                </div>

                {/* ---------------- Candidate Grid ---------------- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {candidates.map(candidate => (
                        <div
                            key={candidate.usn}
                            onClick={() => handleCandidateClick(candidate)}
                            className={`group relative rounded-xl border p-5 transition cursor-pointer hover:shadow-lg hover:shadow-primary/5 ${selected.has(candidate.usn!)
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                }`}
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h3 className="font-semibold text-lg leading-tight">
                                        {candidate.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {candidate.field_of_study}
                                    </p>
                                </div>

                                {/* Checkbox */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSelect(candidate.usn!);
                                    }}
                                    className="shrink-0 rounded-lg p-2 hover:bg-muted/60 transition"
                                >
                                    {selected.has(candidate.usn!) ? (
                                        <CheckSquare className="text-primary w-5 h-5" />
                                    ) : (
                                        <Square className="text-muted-foreground w-5 h-5" />
                                    )}
                                </button>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                <div className="rounded-lg border border-border/60 bg-background/40 px-3 py-2">
                                    <p className="text-xs text-muted-foreground">USN</p>
                                    <p className="font-medium text-foreground">{candidate.usn}</p>
                                </div>
                                <div className="rounded-lg border border-border/60 bg-background/40 px-3 py-2">
                                    <p className="text-xs text-muted-foreground">CGPA</p>
                                    <p className="font-medium text-foreground">{candidate.cgpa}</p>
                                </div>
                                <div className="col-span-2 rounded-lg border border-border/60 bg-background/40 px-3 py-2">
                                    <p className="text-xs text-muted-foreground">Experience</p>
                                    <p className="font-medium text-foreground">{candidate.years_of_experience} yrs</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* ---------------- Modals ---------------- */}
            <CandidateDetailsModal
                open={showCandidateDetails}
                onOpenChange={setShowCandidateDetails}
                candidate={selectedCandidateDetails}
                isLoading={isLoadingDetails}
            />

            <InterviewSetupModal
                open={showInterviewModal}
                onClose={() => setShowInterviewModal(false)}
                selectedCandidates={selectedCandidates}
                onSubmit={(data) => {
                    console.log("Interview Info:", data);
                    console.log("Selected Candidates:", selectedCandidates);

                    // 🔜 POST to backend:
                    // { interview: data, candidates: selectedCandidates }

                    setShowInterviewModal(false);
                }}
            />
        </div>
    );
};

export default ShortlistedCandidates;
