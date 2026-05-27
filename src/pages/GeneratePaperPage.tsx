import { useState, useRef, useEffect } from "react";
import {
  Grid,
  Text,
  Group,
  Badge,
  Progress,
  Textarea,
  TextInput,
  Select,
  MultiSelect,
  Modal,
  Loader,
  Tooltip,
  Divider,
  Switch,
  Stack,
  Collapse,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { gsap } from "gsap";
import {
  RiSparklingLine,
  RiUploadLine,
  RiLinkM,
  RiCheckLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiMagicLine,
  RiRefreshLine,
  RiSaveLine,
  RiEyeLine,
  RiSendPlaneLine,
  RiSettings3Line,
  RiLightbulbLine,
} from "react-icons/ri";
import {
  CHAPTERS,
  RESEARCH_FIELDS,
  CITATION_STYLES,
  mockUser,
} from "../data/mockData";
import { notifications } from "@mantine/notifications";
import {
  RiNumber1,
  RiNumber2,
  RiNumber3,
  RiNumber4,
  RiNumber5,
  RiNumber6,
  RiNumber7,
} from "react-icons/ri";
import React from "react";

const PAPER_TYPES = [
  { value: "research", label: "Full Research Paper (8,000–15,000 words)" },
  { value: "review", label: "Systematic Review Paper" },
  { value: "short", label: "Short Communication (2,000–4,000 words)" },
  { value: "conference", label: "Conference Paper (4,000–8,000 words)" },
  { value: "letter", label: "Research Letter (800–1,500 words)" },
  { value: "thesis", label: "Thesis Chapter" },
];

const chapter_icons = [
  RiNumber1,
  RiNumber2,
  RiNumber3,
  RiNumber4,
  RiNumber5,
  RiNumber6,
  RiNumber7,
];

function ChapterCard({
  chapter,
  index,
  isExpanded,
  onToggle,
  chapterData,
  onUpdate,
  onGenerate,
  generating,
}: any) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          delay: index * 0.07,
          ease: "power2.out",
        },
      );
    }
  }, []);

  const isCompleted = chapterData?.generated && chapterData?.content;

  return (
    <div
      ref={cardRef}
      className={`chapter-card ${isExpanded ? "expanded" : ""}`}
    >
      {/* Chapter Header */}
      <div className="chapter-header" onClick={onToggle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className={`chapter-number ${isCompleted ? "completed" : ""}`}>
            {isCompleted ? (
              <RiCheckLine size={14} color="var(--success)" />
            ) : (
              React.createElement(chapter_icons[index], { size: 17 })
            )}
          </div>
          <div>
            <Text
              size="14px"
              fw={800}
              style={{ color: "var(--neutral-800)", letterSpacing: "-0.01em" }}
            >
              {chapter.title}
            </Text>
            <Text size="11.5px" c="var(--neutral-400)" mt={1}>
              {chapter.desc} · {chapter.words} words
            </Text>
          </div>
        </div>
        <Group gap={8}>
          {isCompleted && (
            <Badge
              size="sm"
              style={{
                background: "var(--success-light)",
                color: "var(--success)",
                fontWeight: 800,
                fontSize: "10px",
              }}
            >
              Generated
            </Badge>
          )}
          {isExpanded ? (
            <RiArrowUpSLine size={17} color="var(--neutral-400)" />
          ) : (
            <RiArrowDownSLine size={17} color="var(--neutral-400)" />
          )}
        </Group>
      </div>

      {/* Chapter Body */}
      <Collapse expanded={isExpanded}>
        <div className="chapter-body">
          <div
            style={{
              height: "1px",
              background: "var(--neutral-100)",
              marginBottom: "16px",
            }}
          />

          <Grid gap="md">
            {/* Left: Prompt */}
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Stack gap="sm">
                <Textarea
                  label={`Prompt for ${chapter.title}`}
                  placeholder={`Describe what you want in the ${chapter.title.toLowerCase()}. Be specific about key points, data, or arguments to include...`}
                  minRows={4}
                  value={chapterData?.prompt || ""}
                  onChange={(e) => onUpdate({ prompt: e.target.value })}
                  styles={{
                    input: {
                      borderRadius: "10px",
                      fontSize: "13.5px",
                      border: "1.5px solid var(--neutral-200)",
                      "&:focus": { borderColor: "var(--color-600)" },
                    },
                    label: {
                      fontWeight: 700,
                      fontSize: "13px",
                      marginBottom: "5px",
                    },
                  }}
                />

                {/* Special fields per chapter */}
                {chapter.id === "literature" && (
                  <TextInput
                    label="Key Papers / DOIs to Include"
                    placeholder="10.1038/..., 10.1016/... (comma-separated)"
                    value={chapterData?.dois || ""}
                    onChange={(e) => onUpdate({ dois: e.target.value })}
                    leftSection={
                      <RiLinkM size={14} color="var(--neutral-400)" />
                    }
                    styles={{ label: { fontWeight: 700, fontSize: "13px" } }}
                  />
                )}

                {chapter.id === "methodology" && (
                  <Select
                    label="Research Methodology"
                    placeholder="Select methodology type"
                    data={[
                      "Quantitative",
                      "Qualitative",
                      "Mixed Methods",
                      "Experimental",
                      "Observational",
                      "Computational",
                      "Meta-Analysis",
                    ]}
                    value={chapterData?.methodology || null}
                    onChange={(v) => onUpdate({ methodology: v })}
                    styles={{ label: { fontWeight: 700, fontSize: "13px" } }}
                  />
                )}

                {/* Generated Content Preview */}
                {isCompleted && chapterData?.content && (
                  <div
                    style={{
                      background: "var(--neutral-50)",
                      border: "1.5px solid var(--neutral-150)",
                      borderRadius: "10px",
                      padding: "14px",
                    }}
                  >
                    <Text
                      size="11px"
                      fw={800}
                      c="var(--neutral-400)"
                      mb={6}
                      style={{
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Generated Content Preview
                    </Text>
                    <Text
                      size="13px"
                      style={{ color: "var(--neutral-700)", lineHeight: 1.6 }}
                      lineClamp={5}
                    >
                      {chapterData.content}
                    </Text>
                    <button
                      className="btn-ghost"
                      style={{
                        marginTop: "8px",
                        fontSize: "12px",
                        padding: "5px 10px",
                      }}
                    >
                      <RiEyeLine size={12} /> View Full Content
                    </button>
                  </div>
                )}
              </Stack>
            </Grid.Col>

            {/* Right: Uploads + Options */}
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Stack gap="sm">
                <div>
                  <Text
                    size="13px"
                    fw={700}
                    style={{ color: "var(--neutral-700)", marginBottom: "6px" }}
                  >
                    Attachments
                  </Text>
                  <div
                    style={{
                      border: "2px dashed var(--neutral-200)",
                      borderRadius: "10px",
                      padding: "16px",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      background: "var(--neutral-50)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-400)";
                      e.currentTarget.style.background = "var(--color-100)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--neutral-200)";
                      e.currentTarget.style.background = "var(--neutral-50)";
                    }}
                  >
                    <RiUploadLine
                      size={20}
                      color="var(--neutral-400)"
                      style={{ marginBottom: "6px" }}
                    />
                    <Text size="12.5px" fw={600} c="var(--neutral-500)">
                      Drop files or click to upload
                    </Text>
                    <Text size="11px" c="var(--neutral-300)" mt={2}>
                      Images, PDFs, CSVs, Datasets
                    </Text>
                  </div>
                </div>

                <TextInput
                  label="Reference Links"
                  placeholder="https://arxiv.org/abs/..."
                  leftSection={<RiLinkM size={14} color="var(--neutral-400)" />}
                  styles={{ label: { fontWeight: 700, fontSize: "13px" } }}
                />

                <div
                  style={{
                    background: "var(--color-100)",
                    border: "1px solid var(--color-200)",
                    borderRadius: "10px",
                    padding: "12px",
                  }}
                >
                  <Text
                    size="12px"
                    fw={800}
                    style={{ color: "var(--color-700)", marginBottom: "4px" }}
                  >
                    <RiLightbulbLine size={12} style={{ marginRight: "4px" }} />
                    AI Tip
                  </Text>
                  <Text
                    size="11.5px"
                    style={{ color: "var(--color-800)", lineHeight: 1.45 }}
                  >
                    {chapter.id === "introduction" &&
                      "Start with a compelling hook — a surprising statistic, a gap in knowledge, or a real-world problem."}
                    {chapter.id === "abstract" &&
                      "Keep it under 300 words. Include objective, methods, results, and conclusions."}
                    {chapter.id === "literature" &&
                      "Organize by themes, not chronologically. Highlight gaps that your research addresses."}
                    {chapter.id === "methodology" &&
                      "Be reproducible. Another researcher should be able to replicate your work exactly."}
                    {chapter.id === "results" &&
                      "Separate results from interpretation. Use visuals where data is complex."}
                    {chapter.id === "conclusion" &&
                      "Summarize key contributions and suggest concrete future research directions."}
                    {chapter.id === "references" &&
                      "We auto-format citations. Just specify your citation style in the paper settings."}
                  </Text>
                </div>

                {/* Generate Button */}
                <button
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={onGenerate}
                  disabled={generating}
                >
                  {generating ? (
                    <>
                      <Loader size={14} color="white" /> Generating...
                    </>
                  ) : isCompleted ? (
                    <>
                      <RiRefreshLine size={14} /> Regenerate
                    </>
                  ) : (
                    <>
                      <RiSparklingLine size={14} /> Generate with AI
                    </>
                  )}
                </button>
              </Stack>
            </Grid.Col>
          </Grid>
        </div>
      </Collapse>
    </div>
  );
}

export default function GeneratePaperPage() {
  //const [step, setStep] = useState(0);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(
    "abstract",
  );
  const [paperConfig, setPaperConfig] = useState({
    title: "",
    type: "research",
    field: "",
    keywords: [] as string[],
    citationStyle: "APA 7th Edition",
    targetJournal: "",
    tone: "formal",
    includeAbstract: true,
  });
  const [chapterData, setChapterData] = useState<Record<string, any>>({});
  const [generatingChapter, setGeneratingChapter] = useState<string | null>(
    null,
  );
  const [previewOpened, { open: openPreview, close: closePreview }] =
    useDisclosure(false);

  const headerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
      );
    }
  }, []);

  const totalGenerated = Object.values(chapterData).filter(
    (d: any) => d?.generated,
  ).length;
  const completionPct = Math.round((totalGenerated / CHAPTERS.length) * 100);

  const handleGenerate = async (chapterId: string) => {
    setGeneratingChapter(chapterId);
    // Simulate AI generation
    await new Promise((r) => setTimeout(r, 2200));
    setChapterData((prev) => ({
      ...prev,
      [chapterId]: {
        ...prev[chapterId],
        generated: true,
        content: `This is the AI-generated content for the ${chapterId} section. The content has been crafted based on your research topic "${paperConfig.title || "your research topic"}", incorporating the latest methodologies and following academic standards. The writing style is formal and suitable for publication in high-impact journals. This paragraph demonstrates the depth and quality of the generated content, which would typically span several paragraphs with proper citations, logical flow, and comprehensive coverage of the topic as specified in your prompt.`,
      },
    }));
    setGeneratingChapter(null);
    notifications.show({
      title: `${chapterId.charAt(0).toUpperCase() + chapterId.slice(1)} Generated!`,
      message:
        "AI has successfully generated this section. Review and refine as needed.",
      color: "green",
      icon: <RiCheckLine />,
    });
  };

  const handleSave = () => {
    notifications.show({
      title: "Paper Saved",
      message: "Your progress has been saved successfully.",
      color: "brand",
      icon: <RiSaveLine />,
    });
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header" ref={headerRef}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <Text
              size="13px"
              fw={600}
              style={{
                color: "var(--color-600)",
                marginBottom: "4px",
                textTransform: "uppercase",
              }}
            >
              <RiMagicLine size={13} style={{ marginRight: "4px" }} /> AI Paper
              Generation
            </Text>
            <h1 className="page-title">Generate Research Paper</h1>
            <p className="page-subtitle">
              Define your paper structure and let AI craft each section with
              precision.
            </p>
          </div>
          <Group gap={8}>
            <button className="btn-ghost" onClick={handleSave}>
              <RiSaveLine size={14} /> Save Draft
            </button>
            <button className="btn-secondary" onClick={openPreview}>
              <RiEyeLine size={14} /> Preview
            </button>
            <button className="btn-primary">
              <RiSendPlaneLine size={14} /> Submit to Journal
            </button>
          </Group>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          background: "#fff",
          borderRadius: "var(--radius-lg)",
          padding: "16px 20px",
          border: "1px solid var(--neutral-150)",
          marginBottom: "20px",
        }}
        className="animate-fade-up"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <Text size="13px" fw={800} style={{ color: "var(--neutral-800)" }}>
            Paper Completion
          </Text>
          <Group gap={16}>
            <Text size="12px" fw={700} c="var(--neutral-500)">
              {totalGenerated}/{CHAPTERS.length} sections done
            </Text>
            <Text size="14px" fw={900} style={{ color: "var(--color-700)" }}>
              {completionPct}%
            </Text>
          </Group>
        </div>
        <Progress
          value={completionPct}
          color="brand"
          size={8}
          radius="xl"
          style={{ background: "var(--neutral-100)" }}
        />
        <Group gap={4} mt={10} wrap="wrap">
          {CHAPTERS.map((ch) => (
            <Tooltip key={ch.id} label={ch.title} position="top">
              <div
                style={{
                  width: 28,
                  height: 6,
                  borderRadius: "3px",
                  background: chapterData[ch.id]?.generated
                    ? "var(--color-700)"
                    : "var(--neutral-150)",
                  transition: "background 0.3s",
                  cursor: "pointer",
                }}
                onClick={() =>
                  setExpandedChapter(expandedChapter === ch.id ? null : ch.id)
                }
              />
            </Tooltip>
          ))}
        </Group>
      </div>

      <Grid gap="md">
        {/* Left: Paper Config */}
        <Grid.Col span={{ base: 12, lg: 3 }}>
          <div
            className="section-card animate-fade-up"
            style={{ animationDelay: "0.1s", position: "sticky", top: "20px" }}
          >
            <div className="section-card-header">
              <span className="section-card-title">
                <RiSettings3Line size={14} style={{ marginRight: "5px" }} />{" "}
                Paper Settings
              </span>
            </div>
            <div className="section-card-body">
              <Stack gap="sm">
                <TextInput
                  label="Paper Title"
                  placeholder="Enter your research title..."
                  value={paperConfig.title}
                  onChange={(e) =>
                    setPaperConfig((p) => ({ ...p, title: e.target.value }))
                  }
                  styles={{ label: { fontWeight: 700, fontSize: "12.5px" } }}
                />
                <Select
                  label="Paper Type"
                  data={PAPER_TYPES}
                  value={paperConfig.type}
                  onChange={(v) =>
                    setPaperConfig((p) => ({ ...p, type: v || "research" }))
                  }
                  styles={{ label: { fontWeight: 700, fontSize: "12.5px" } }}
                />
                <Select
                  label="Research Field"
                  placeholder="Select field..."
                  data={RESEARCH_FIELDS}
                  searchable
                  value={paperConfig.field}
                  onChange={(v) =>
                    setPaperConfig((p) => ({ ...p, field: v || "" }))
                  }
                  styles={{ label: { fontWeight: 700, fontSize: "12.5px" } }}
                />
                <MultiSelect
                  label="Keywords"
                  placeholder="Add keywords..."
                  data={[]}
                  //creatable
                  value={paperConfig.keywords}
                  onChange={(v) =>
                    setPaperConfig((p) => ({ ...p, keywords: v }))
                  }
                  styles={{ label: { fontWeight: 700, fontSize: "12.5px" } }}
                />
                <Select
                  label="Citation Style"
                  data={CITATION_STYLES}
                  value={paperConfig.citationStyle}
                  onChange={(v) =>
                    setPaperConfig((p) => ({
                      ...p,
                      citationStyle: v || "APA 7th Edition",
                    }))
                  }
                  styles={{ label: { fontWeight: 700, fontSize: "12.5px" } }}
                />
                <TextInput
                  label="Target Journal (optional)"
                  placeholder="e.g. Nature Communications"
                  value={paperConfig.targetJournal}
                  onChange={(e) =>
                    setPaperConfig((p) => ({
                      ...p,
                      targetJournal: e.target.value,
                    }))
                  }
                  styles={{ label: { fontWeight: 700, fontSize: "12.5px" } }}
                />
                <Select
                  label="Writing Tone"
                  data={[
                    "Formal (Academic)",
                    "Technical",
                    "Analytical",
                    "Balanced",
                  ]}
                  value={paperConfig.tone}
                  onChange={(v) =>
                    setPaperConfig((p) => ({ ...p, tone: v || "formal" }))
                  }
                  styles={{ label: { fontWeight: 700, fontSize: "12.5px" } }}
                />

                <Divider my={4} />

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {[
                    "Include Abstract",
                    "Auto-format References",
                    "Add Acknowledgements",
                    "Include Appendix",
                  ].map((opt, i) => (
                    <Switch
                      key={opt}
                      label={
                        <Text size="12.5px" fw={600} c="var(--neutral-700)">
                          {opt}
                        </Text>
                      }
                      defaultChecked={i < 2}
                      color="brand"
                      size="xs"
                    />
                  ))}
                </div>

                <button
                  className="btn-primary"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    marginTop: "4px",
                  }}
                  onClick={() => {
                    CHAPTERS.forEach((ch) => {
                      setTimeout(
                        () => handleGenerate(ch.id),
                        Math.random() * 500,
                      );
                    });
                    notifications.show({
                      title: "🚀 Full Paper Generation Started",
                      message:
                        "AI is generating all sections simultaneously. This may take a moment.",
                      color: "brand",
                    });
                  }}
                >
                  <RiSparklingLine size={14} /> Generate Full Paper
                </button>
              </Stack>
            </div>
          </div>
        </Grid.Col>

        {/* Right: Chapters */}
        <Grid.Col span={{ base: 12, lg: 9 }}>
          <Stack gap="md">
            {CHAPTERS.map((chapter, index) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                index={index}
                isExpanded={expandedChapter === chapter.id}
                onToggle={() =>
                  setExpandedChapter(
                    expandedChapter === chapter.id ? null : chapter.id,
                  )
                }
                chapterData={chapterData[chapter.id] || {}}
                onUpdate={(updates: any) =>
                  setChapterData((prev) => ({
                    ...prev,
                    [chapter.id]: { ...prev[chapter.id], ...updates },
                  }))
                }
                onGenerate={() => handleGenerate(chapter.id)}
                generating={generatingChapter === chapter.id}
              />
            ))}
          </Stack>
        </Grid.Col>
      </Grid>

      {/* Preview Modal */}
      <Modal
        opened={previewOpened}
        onClose={closePreview}
        title="Paper Preview"
        size="xl"
        styles={{
          content: { borderRadius: "16px" },
          header: {
            borderBottom: "1px solid var(--neutral-150)",
            paddingBottom: "14px",
          },
        }}
      >
        <div
          style={{ padding: "20px 0", fontFamily: "'Nunito Sans', sans-serif" }}
        >
          {paperConfig.title ? (
            <>
              <Text
                size="20px"
                fw={900}
                style={{
                  letterSpacing: "-0.02em",
                  marginBottom: "16px",
                  textAlign: "center",
                }}
              >
                {paperConfig.title}
              </Text>
              <Text
                size="13px"
                c="var(--neutral-500)"
                style={{ textAlign: "center", marginBottom: "24px" }}
              >
                {mockUser.name} · {paperConfig.field || "Research Field"} ·{" "}
                {new Date().getFullYear()}
              </Text>
              <Divider mb={20} />
              {CHAPTERS.map(
                (ch) =>
                  chapterData[ch.id]?.content && (
                    <div key={ch.id} style={{ marginBottom: "24px" }}>
                      <Text
                        size="16px"
                        fw={900}
                        style={{
                          marginBottom: "10px",
                          color: "var(--neutral-900)",
                        }}
                      >
                        {ch.title}
                      </Text>
                      <Text
                        size="13.5px"
                        style={{
                          lineHeight: 1.75,
                          color: "var(--neutral-700)",
                        }}
                      >
                        {chapterData[ch.id].content}
                      </Text>
                    </div>
                  ),
              )}
              {totalGenerated === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">📄</div>
                  <div className="empty-state-title">
                    No content generated yet
                  </div>
                  <div className="empty-state-desc">
                    Generate sections first to preview your paper here
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">✏️</div>
              <div className="empty-state-title">Add a paper title first</div>
              <div className="empty-state-desc">
                Enter your paper title and settings to get started
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
