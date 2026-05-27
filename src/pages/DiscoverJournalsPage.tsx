import { useState, useRef, useEffect } from "react";
import {
  Grid,
  Text,
  Group,
  Modal,
  Stack,
  Divider,
  MultiSelect,
  RangeSlider,
  Select,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { gsap } from "gsap";
import {
  RiCompassLine,
  RiSearchLine,
  RiStarLine,
  RiTimeLine,
  RiPercentLine,
  RiSendPlaneLine,
  RiInformationLine,
  RiArticleLine,
} from "react-icons/ri";
import { mockJournals, mockPapers } from "../data/mockData";
import { notifications } from "@mantine/notifications";

const FIELD_OPTIONS = [
  "Artificial Intelligence",
  "Machine Learning",
  "Biomedical Engineering",
  "Clinical Medicine",
  "Environmental Science",
  "Physics",
  "Chemistry",
  "Digital Health",
  "Transportation",
  "Multidisciplinary",
];

function JournalCard({ journal, onView, onSubmit }: any) {
  const rankColors: Record<string, { bg: string; color: string }> = {
    Q1: { bg: "#fef9c3", color: "#854d0e" },
    Q2: { bg: "#dcfce7", color: "#166534" },
    Q3: { bg: "#dbeafe", color: "#1e40af" },
    Q4: { bg: "var(--neutral-150)", color: "var(--neutral-600)" },
  };
  const rankStyle = rankColors[journal.rank] || rankColors.Q4;

  return (
    <div
      className="journal-card animate-fade-up"
      onClick={() => onView(journal)}
    >
      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <div style={{ flex: 1, minWidth: 0, paddingRight: "10px" }}>
          <Text
            size="14.5px"
            fw={800}
            style={{
              color: "var(--neutral-900)",
              letterSpacing: "-0.01em",
              lineHeight: 1.3,
              marginBottom: "4px",
            }}
            lineClamp={2}
          >
            {journal.name}
          </Text>
          <Text size="12px" fw={600} c="var(--neutral-400)">
            {journal.publisher}
          </Text>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "5px",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 800,
              padding: "3px 9px",
              background: rankStyle.bg,
              color: rankStyle.color,
              borderRadius: "99px",
              letterSpacing: "0.04em",
            }}
          >
            {journal.rank}
          </span>
          {journal.openAccess && (
            <span
              style={{
                fontSize: "10px",
                fontWeight: 800,
                padding: "2px 7px",
                background: "#dbeafe",
                color: "#1e40af",
                borderRadius: "99px",
              }}
            >
              Open Access
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <Text
        size="12.5px"
        c="var(--neutral-500)"
        lineClamp={2}
        style={{ lineHeight: 1.5, marginBottom: "14px" }}
      >
        {journal.description}
      </Text>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "8px",
          marginBottom: "14px",
        }}
      >
        {[
          {
            label: "Impact Factor",
            value: journal.impactFactor,
            icon: <RiStarLine size={12} />,
            color: "var(--warning)",
          },
          {
            label: "Avg. Days",
            value: journal.turnaroundDays,
            icon: <RiTimeLine size={12} />,
            color: "var(--info)",
          },
          {
            label: "Accept Rate",
            value: `${journal.acceptanceRate}%`,
            icon: <RiPercentLine size={12} />,
            color: "var(--success)",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "var(--neutral-50)",
              borderRadius: "8px",
              padding: "8px 10px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "3px",
                color: stat.color,
                marginBottom: "2px",
              }}
            >
              {stat.icon}
              <Text
                size="13.5px"
                fw={900}
                style={{ color: "var(--neutral-900)" }}
              >
                {stat.value}
              </Text>
            </div>
            <Text
              size="10px"
              fw={700}
              c="var(--neutral-400)"
              style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}
            >
              {stat.label}
            </Text>
          </div>
        ))}
      </div>

      {/* Indexed in */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "14px",
          flexWrap: "wrap",
        }}
      >
        <Text size="11px" fw={700} c="var(--neutral-400)">
          Indexed:
        </Text>
        {journal.indexed.map((idx: string) => (
          <span
            key={idx}
            style={{
              fontSize: "10.5px",
              fontWeight: 700,
              padding: "2px 7px",
              background: "var(--neutral-100)",
              color: "var(--neutral-600)",
              borderRadius: "4px",
            }}
          >
            {idx}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "12px",
          borderTop: "1px solid var(--neutral-100)",
        }}
      >
        <Group gap={6}>
          <RiArticleLine size={13} color="var(--neutral-400)" />
          <Text size="12px" fw={600} c="var(--neutral-500)">
            {journal.field}
          </Text>
        </Group>
        <button
          className="btn-primary"
          style={{ padding: "6px 14px", fontSize: "12.5px" }}
          onClick={(e) => {
            e.stopPropagation();
            onSubmit(journal);
          }}
        >
          <RiSendPlaneLine size={12} /> Submit
        </button>
      </div>
    </div>
  );
}

export default function DiscoverJournalsPage() {
  const [search, setSearch] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [rankFilter, setRankFilter] = useState<string[]>([]);
  const [ifRange, setIfRange] = useState<[number, number]>([0, 30]);
  const [openAccessOnly, setOpenAccessOnly] = useState(false);
  const [sortBy, setSortBy] = useState("impact");
  const [selectedJournal, setSelectedJournal] = useState<any>(null);
  const [detailOpened, { open, close }] = useDisclosure(false);
  const [submitOpened, { open: openSubmit, close: closeSubmit }] =
    useDisclosure(false);
  const [submitJournal, setSubmitJournal] = useState<any>(null);
  const [activeView, setActiveView] = useState<"grid" | "list">("grid");
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current)
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4 },
      );
  }, []);

  const filtered = mockJournals
    .filter((j) => {
      const matchSearch =
        !search ||
        j.name.toLowerCase().includes(search.toLowerCase()) ||
        j.publisher.toLowerCase().includes(search.toLowerCase());
      const matchField =
        selectedFields.length === 0 || selectedFields.includes(j.field);
      const matchRank = rankFilter.length === 0 || rankFilter.includes(j.rank);
      const matchIF =
        j.impactFactor >= ifRange[0] && j.impactFactor <= ifRange[1];
      const matchOA = !openAccessOnly || j.openAccess;
      return matchSearch && matchField && matchRank && matchIF && matchOA;
    })
    .sort((a, b) => {
      if (sortBy === "impact") return b.impactFactor - a.impactFactor;
      if (sortBy === "acceptance") return b.acceptanceRate - a.acceptanceRate;
      if (sortBy === "speed") return a.turnaroundDays - b.turnaroundDays;
      return a.name.localeCompare(b.name);
    });

  const handleView = (journal: any) => {
    setSelectedJournal(journal);
    open();
  };

  const handleSubmit = (journal: any) => {
    setSubmitJournal(journal);
    openSubmit();
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
              <RiCompassLine size={13} style={{ marginRight: "4px" }} /> Journal
              Discovery
            </Text>
            <h1 className="page-title">Discover Journals</h1>
            <p className="page-subtitle">
              Find the perfect venue for your research across thousands of
              international journals
            </p>
          </div>
          <div
            style={{
              border: "2px solid var(--color-500)",
              borderRadius: "3px",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div>
              <Text
                size="12.5px"
                fw={800}
                style={{ color: "var(--color-800)" }}
              >
                AI Journal Matcher
              </Text>
              <Text size="11.5px" style={{ color: "var(--color-700)" }}>
                Get instant recommendations based on your paper
              </Text>
            </div>
            <button
              className="btn-primary"
              style={{ fontSize: "12px", padding: "7px 14px", flexShrink: 0 }}
            >
              Match Now
            </button>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div
        className="section-card animate-fade-up"
        style={{ marginBottom: "20px" }}
      >
        <div className="section-card-body">
          <Grid gap="sm" align="flex-end">
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Text size="12px" fw={700} c="var(--neutral-600)" mb={5}>
                Search Journals
              </Text>
              <div className="search-bar">
                <RiSearchLine size={15} color="var(--neutral-400)" />
                <input
                  placeholder="Journal name, publisher..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <MultiSelect
                label="Research Field"
                placeholder="All fields"
                data={FIELD_OPTIONS}
                value={selectedFields}
                onChange={setSelectedFields}
                clearable
                styles={{ label: { fontWeight: 700, fontSize: "12px" } }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 2 }}>
              <MultiSelect
                label="Quartile Rank"
                placeholder="All ranks"
                data={["Q1", "Q2", "Q3", "Q4"]}
                value={rankFilter}
                onChange={setRankFilter}
                clearable
                styles={{ label: { fontWeight: 700, fontSize: "12px" } }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 2 }}>
              <Select
                label="Sort By"
                data={[
                  { value: "impact", label: "Impact Factor" },
                  { value: "acceptance", label: "Acceptance Rate" },
                  { value: "speed", label: "Turnaround Speed" },
                  { value: "name", label: "Name" },
                ]}
                value={sortBy}
                onChange={(v) => setSortBy(v || "impact")}
                styles={{ label: { fontWeight: 700, fontSize: "12px" } }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 1 }}>
              <button
                className={`filter-chip ${openAccessOnly ? "active" : ""}`}
                onClick={() => setOpenAccessOnly(!openAccessOnly)}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "9px 10px",
                }}
              >
                OA Only
              </button>
            </Grid.Col>
          </Grid>

          {/* Impact Factor Range */}
          <div
            style={{
              marginTop: "16px",
              paddingTop: "14px",
              borderTop: "1px solid var(--neutral-100)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <Text size="12px" fw={700} c="var(--neutral-600)">
                Impact Factor Range
              </Text>
              <Text size="12px" fw={800} style={{ color: "var(--color-700)" }}>
                {ifRange[0]} – {ifRange[1]}
              </Text>
            </div>
            <RangeSlider
              min={0}
              max={30}
              step={0.5}
              value={ifRange}
              onChange={setIfRange}
              color="brand"
              size="sm"
              styles={{
                thumb: {
                  borderColor: "var(--color-700)",
                  background: "var(--color-700)",
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Results count */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "14px",
        }}
      >
        <Text size="13px" fw={700} c="var(--neutral-600)">
          Showing{" "}
          <span style={{ color: "var(--color-700)" }}>{filtered.length}</span>{" "}
          journals
        </Text>
        <Group gap={6}>
          {["grid", "list"].map((v) => (
            <button
              key={v}
              className={`filter-chip ${activeView === v ? "active" : ""}`}
              onClick={() => setActiveView(v as any)}
              style={{ padding: "5px 12px" }}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </Group>
      </div>

      {/* Journal Grid */}
      {filtered.length > 0 ? (
        <Grid gap="md">
          {filtered.map((journal, i) => (
            <Grid.Col
              key={journal.id}
              span={{
                base: 12,
                sm: activeView === "list" ? 12 : 6,
                lg: activeView === "list" ? 12 : 4,
              }}
            >
              <div style={{ height: "100%", animationDelay: `${i * 0.06}s` }}>
                <JournalCard
                  journal={journal}
                  onView={handleView}
                  onSubmit={handleSubmit}
                />
              </div>
            </Grid.Col>
          ))}
        </Grid>
      ) : (
        <div className="section-card">
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-title">No journals found</div>
            <div className="empty-state-desc">
              Try adjusting your filters to find relevant journals
            </div>
          </div>
        </div>
      )}

      {/* Journal Detail Modal */}
      <Modal
        opened={detailOpened && !!selectedJournal}
        onClose={close}
        title={selectedJournal?.name}
        size="lg"
        centered
      >
        {selectedJournal && (
          <Stack gap="md">
            <Group gap={8} wrap="wrap">
              <span
                style={{
                  fontSize: "11.5px",
                  fontWeight: 800,
                  padding: "4px 10px",
                  background:
                    selectedJournal.rank === "Q1" ? "#fef9c3" : "#dcfce7",
                  color: selectedJournal.rank === "Q1" ? "#854d0e" : "#166534",
                  borderRadius: "99px",
                }}
              >
                {selectedJournal.rank}
              </span>
              {selectedJournal.openAccess && (
                <span
                  style={{
                    fontSize: "11.5px",
                    fontWeight: 800,
                    padding: "4px 10px",
                    background: "#dbeafe",
                    color: "#1e40af",
                    borderRadius: "99px",
                  }}
                >
                  Open Access
                </span>
              )}
              <Text size="12.5px" fw={600} c="var(--neutral-500)">
                {selectedJournal.publisher}
              </Text>
            </Group>

            <Text
              size="13.5px"
              c="var(--neutral-600)"
              style={{ lineHeight: 1.6 }}
            >
              {selectedJournal.description}
            </Text>
            <Divider />

            <Grid>
              {[
                { label: "Impact Factor", value: selectedJournal.impactFactor },
                {
                  label: "Acceptance Rate",
                  value: `${selectedJournal.acceptanceRate}%`,
                },
                {
                  label: "Avg. Turnaround",
                  value: `${selectedJournal.turnaroundDays} days`,
                },
                {
                  label: "APC Fee",
                  value:
                    selectedJournal.requirements.fee === 0
                      ? "Free"
                      : `$${selectedJournal.requirements.fee}`,
                },
              ].map((item) => (
                <Grid.Col key={item.label} span={6}>
                  <div
                    style={{
                      background: "var(--neutral-50)",
                      borderRadius: "10px",
                      padding: "12px 14px",
                    }}
                  >
                    <Text
                      size="11px"
                      fw={700}
                      c="var(--neutral-400)"
                      style={{
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: "4px",
                      }}
                    >
                      {item.label}
                    </Text>
                    <Text
                      size="20px"
                      fw={900}
                      style={{
                        color: "var(--neutral-900)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {item.value}
                    </Text>
                  </div>
                </Grid.Col>
              ))}
            </Grid>

            <div>
              <Text size="13px" fw={800} c="var(--neutral-700)" mb={8}>
                Submission Requirements
              </Text>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                {[
                  {
                    label: "Word Count",
                    value: `${selectedJournal.requirements.minWords.toLocaleString()} – ${selectedJournal.requirements.maxWords.toLocaleString()} words`,
                  },
                  {
                    label: "Citation Style",
                    value: selectedJournal.requirements.citationStyle,
                  },
                  {
                    label: "Indexed In",
                    value: selectedJournal.indexed.join(", "),
                  },
                ].map((req) => (
                  <div
                    key={req.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      background: "var(--neutral-50)",
                      borderRadius: "8px",
                    }}
                  >
                    <Text size="12.5px" fw={700} c="var(--neutral-500)">
                      {req.label}
                    </Text>
                    <Text size="12.5px" fw={700} c="var(--neutral-800)">
                      {req.value}
                    </Text>
                  </div>
                ))}
              </div>
            </div>

            <Group justify="flex-end" gap={10}>
              <button className="btn-ghost" onClick={close}>
                Close
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  close();
                  handleSubmit(selectedJournal);
                }}
              >
                <RiSendPlaneLine size={14} /> Submit Paper Here
              </button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Submit to Journal Modal */}
      <Modal
        opened={submitOpened}
        onClose={closeSubmit}
        title={`Submit to ${submitJournal?.name}`}
        size="md"
        centered
      >
        <Stack gap="sm">
          <Select
            label="Select Paper"
            placeholder="Choose paper to submit..."
            data={mockPapers.map((p) => ({ value: p.id, label: p.title }))}
            searchable
            styles={{ label: { fontWeight: 700 } }}
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
              style={{ color: "var(--color-700)", marginBottom: "6px" }}
            >
              <RiInformationLine size={12} style={{ marginRight: "4px" }} />
              Requirements
            </Text>
            {submitJournal && (
              <Text
                size="12px"
                c="var(--color-800)"
                style={{ lineHeight: 1.5 }}
              >
                {submitJournal.requirements.minWords.toLocaleString()}–
                {submitJournal.requirements.maxWords.toLocaleString()} words ·{" "}
                {submitJournal.requirements.citationStyle} style
                {submitJournal.requirements.fee > 0 &&
                  ` · APC: $${submitJournal.requirements.fee}`}
              </Text>
            )}
          </div>
          <Divider my={4} />
          <Group justify="flex-end" gap={10}>
            <button className="btn-ghost" onClick={closeSubmit}>
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                closeSubmit();
                notifications.show({
                  title: "🚀 Paper Submitted!",
                  message: `Successfully submitted to ${submitJournal?.name}`,
                  color: "green",
                });
              }}
            >
              <RiSendPlaneLine size={14} /> Confirm Submission
            </button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}
