import { useState, useRef, useEffect } from "react";
import {
  Grid,
  Text,
  Group,
  Menu,
  Modal,
  ActionIcon,
  Divider,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { gsap } from "gsap";
import {
  RiMoreLine,
  RiDeleteBin6Line,
  RiEditLine,
  RiEyeLine,
  RiSendPlaneLine,
  RiDownloadLine,
  RiGroupLine,
  RiSearchLine,
  RiAddLine,
  RiCalendarLine,
  RiBookOpenLine,
  RiCheckLine,
  RiTimeLine,
  RiDraftLine,
  RiSortAsc,
} from "react-icons/ri";
import { mockPapers } from "../data/mockData";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";

const STATUS_TABS = [
  { value: "all", label: "All Papers" },
  { value: "published", label: "Published" },
  { value: "submitted", label: "Submitted" },
  { value: "review", label: "Under Review" },
  { value: "draft", label: "Drafts" },
];

function PaperCard({ paper, onDelete, onView }: any) {
  const cardRef = useRef<HTMLDivElement>(null);

  const getStatusConfig = (status: string) => {
    const map: Record<
      string,
      { label: string; color: string; bg: string; icon: React.ReactNode }
    > = {
      published: {
        label: "Published",
        color: "#0a8a4c",
        bg: "var(--success-light)",
        icon: <RiCheckLine size={11} />,
      },
      draft: {
        label: "Draft",
        color: "var(--neutral-600)",
        bg: "var(--neutral-150)",
        icon: <RiDraftLine size={11} />,
      },
      review: {
        label: "Under Review",
        color: "#b45309",
        bg: "var(--warning-light)",
        icon: <RiTimeLine size={11} />,
      },
      submitted: {
        label: "Submitted",
        color: "#0369a1",
        bg: "var(--info-light)",
        icon: <RiSendPlaneLine size={11} />,
      },
      rejected: {
        label: "Rejected",
        color: "#b42318",
        bg: "var(--error-light)",
        icon: null,
      },
    };
    return map[status] || map.draft;
  };

  const config = getStatusConfig(paper.status);

  return (
    <div
      ref={cardRef}
      className="section-card animate-fade-up"
      style={{ cursor: "pointer", transition: "all 0.2s" }}
      onMouseEnter={(e) => {
        //e.currentTarget.style.boxShadow = "var(--shadow-lg)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        //e.currentTarget.style.boxShadow = "var(--shadow-card)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Status bar top */}
      <div
        style={{
          height: "3px",
          background: config.color,
          width: "100%",
        }}
      />

      <div style={{ padding: "18px 20px" }}>
        {/* Header Row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text
              size="14.5px"
              fw={800}
              style={{
                color: "var(--neutral-900)",
                lineHeight: 1.3,
                letterSpacing: "-0.01em",
                marginBottom: "6px",
                cursor: "pointer",
              }}
              lineClamp={2}
              onClick={onView}
            >
              {paper.title}
            </Text>
            <Group gap={8} wrap="wrap">
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "11.5px",
                  fontWeight: 700,
                  padding: "3px 9px",
                  background: config.bg,
                  color: config.color,
                  borderRadius: "99px",
                }}
              >
                {config.icon}
                {config.label}
              </span>
              {paper.field && (
                <span
                  style={{
                    fontSize: "11.5px",
                    fontWeight: 600,
                    color: "var(--neutral-500)",
                    background: "var(--neutral-100)",
                    padding: "3px 9px",
                    borderRadius: "99px",
                  }}
                >
                  {paper.field}
                </span>
              )}
            </Group>
          </div>
          <Menu width={180} position="bottom-end" shadow="lg" radius="md">
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                color="gray"
                radius="md"
                onClick={(e) => e.stopPropagation()}
              >
                <RiMoreLine size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<RiEyeLine size={13} />} onClick={onView}>
                View Paper
              </Menu.Item>
              <Menu.Item leftSection={<RiEditLine size={13} />}>Edit</Menu.Item>
              <Menu.Item leftSection={<RiSendPlaneLine size={13} />}>
                Submit to Journal
              </Menu.Item>
              <Menu.Item leftSection={<RiGroupLine size={13} />}>
                Add Collaborators
              </Menu.Item>
              <Menu.Item leftSection={<RiDownloadLine size={13} />}>
                Download PDF
              </Menu.Item>
              <Divider />
              <Menu.Item
                leftSection={<RiDeleteBin6Line size={13} />}
                color="red"
                onClick={onDelete}
              >
                Delete Paper
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>

        {/* Abstract */}
        <Text
          size="12.5px"
          c="var(--neutral-500)"
          lineClamp={2}
          style={{ lineHeight: 1.55, marginBottom: "14px" }}
        >
          {paper.abstract}
        </Text>

        {/* Completion Bar (for drafts) */}
        {paper.status === "draft" && (
          <div style={{ marginBottom: "14px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}
            >
              <Text size="11.5px" fw={700} c="var(--neutral-500)">
                Completion
              </Text>
              <Text
                size="11.5px"
                fw={800}
                style={{ color: "var(--color-700)" }}
              >
                {paper.completionRate}%
              </Text>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${paper.completionRate}%` }}
              />
            </div>
          </div>
        )}

        {/* Meta Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "12px",
            borderTop: "1px solid var(--neutral-100)",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <Group gap={12}>
            {paper.journal && (
              <Group gap={5}>
                <RiBookOpenLine size={13} color="var(--neutral-400)" />
                <Text
                  size="12px"
                  fw={600}
                  c="var(--neutral-500)"
                  lineClamp={1}
                  style={{ maxWidth: "180px" }}
                >
                  {paper.journal}
                </Text>
              </Group>
            )}
            {paper.publishedDate && (
              <Group gap={5}>
                <RiCalendarLine size={13} color="var(--neutral-400)" />
                <Text size="12px" fw={600} c="var(--neutral-400)">
                  {new Date(paper.publishedDate).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
              </Group>
            )}
          </Group>
          <Group gap={10}>
            {paper.citations > 0 && (
              <Tooltip label="Citations">
                <Group gap={4} style={{ cursor: "default" }}>
                  <RiBookOpenLine size={13} color="var(--color-600)" />
                  <Text
                    size="12px"
                    fw={800}
                    style={{ color: "var(--color-600)" }}
                  >
                    {paper.citations}
                  </Text>
                </Group>
              </Tooltip>
            )}
            <Text size="12px" fw={600} c="var(--neutral-400)">
              {paper.wordCount.toLocaleString()} words
            </Text>
            {paper.coAuthors.length > 0 && (
              <Group gap={4}>
                <RiGroupLine size={13} color="var(--neutral-400)" />
                <Text size="12px" fw={600} c="var(--neutral-400)">
                  {paper.coAuthors.length}
                </Text>
              </Group>
            )}
          </Group>
        </div>
      </div>
    </div>
  );
}

export default function MyPapersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [papers, setPapers] = useState(mockPapers);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4 },
      );
    }
  }, []);

  const filtered = papers.filter((p) => {
    const matchTab = activeTab === "all" || p.status === activeTab;
    const matchSearch =
      !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleDelete = () => {
    if (deleteTarget) {
      setPapers((prev) => prev.filter((p) => p.id !== deleteTarget));
      closeDelete();
      notifications.show({
        title: "Paper deleted",
        message: "The paper has been removed.",
        color: "red",
      });
    }
  };

  const statsBar = [
    {
      label: "Published",
      count: papers.filter((p) => p.status === "published").length,
      color: "var(--success)",
    },
    {
      label: "Under Review",
      count: papers.filter((p) => p.status === "review").length,
      color: "var(--warning)",
    },
    {
      label: "Submitted",
      count: papers.filter((p) => p.status === "submitted").length,
      color: "var(--info)",
    },
    {
      label: "Drafts",
      count: papers.filter((p) => p.status === "draft").length,
      color: "var(--neutral-400)",
    },
  ];

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
            <h1 className="page-title">My Papers</h1>
            <p className="page-subtitle">
              {papers.length} papers in your library
            </p>
          </div>
          <button className="btn-primary" onClick={() => navigate("/generate")}>
            <RiAddLine size={14} /> New Paper
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {statsBar.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "#fff",
              border: "1px solid var(--neutral-150)",
              borderRadius: "10px",
              padding: "12px 18px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "var(--shadow-xs)",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: stat.color,
              }}
            />
            <Text size="13px" fw={800} style={{ color: "var(--neutral-800)" }}>
              {stat.count}
            </Text>
            <Text size="12.5px" fw={600} c="var(--neutral-500)">
              {stat.label}
            </Text>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        style={{
          background: "#fff",
          borderRadius: "var(--radius-lg)",
          padding: "14px 18px",
          border: "1px solid var(--neutral-150)",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        {/* Search */}
        <div
          className="search-bar"
          style={{ flex: 1, minWidth: "200px", maxWidth: "340px" }}
        >
          <RiSearchLine size={15} color="var(--neutral-400)" />
          <input
            placeholder="Search papers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Tabs */}
        <div style={{ display: "flex", gap: "6px", flex: 1, flexWrap: "wrap" }}>
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              className={`filter-chip ${activeTab === tab.value ? "active" : ""}`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <Group gap={6}>
          <RiSortAsc size={15} color="var(--neutral-400)" />
          <select
            style={{
              border: "1.5px solid var(--neutral-200)",
              borderRadius: "8px",
              padding: "5px 10px",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--neutral-600)",
              background: "#fff",
              outline: "none",
              cursor: "pointer",
              fontFamily: "'Nunito Sans', sans-serif",
            }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="citations">Sort by Citations</option>
            <option value="title">Sort by Title</option>
          </select>
        </Group>
      </div>

      {/* Papers Grid */}
      {filtered.length > 0 ? (
        <Grid gap="md">
          {filtered.map((paper, i) => (
            <Grid.Col key={paper.id} span={{ base: 12, md: 6, xl: 6 }}>
              <div style={{ animationDelay: `${i * 0.06}s` }}>
                <PaperCard
                  paper={paper}
                  onDelete={() => {
                    setDeleteTarget(paper.id);
                    openDelete();
                  }}
                  onView={() => navigate("/generate")}
                />
              </div>
            </Grid.Col>
          ))}
        </Grid>
      ) : (
        <div className="section-card">
          <div className="empty-state">
            <div className="empty-state-icon">📁</div>
            <div className="empty-state-title">No papers found</div>
            <div className="empty-state-desc">
              {searchQuery
                ? `No papers match "${searchQuery}"`
                : "Start generating your first paper with AI"}
            </div>
            <button
              className="btn-primary"
              onClick={() => navigate("/generate")}
            >
              <RiAddLine size={14} /> Generate Paper
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title="Delete Paper"
        size="sm"
        centered
      >
        <Text size="14px" c="var(--neutral-600)" mb={20}>
          Are you sure you want to delete this paper? This action cannot be
          undone.
        </Text>
        <Group justify="flex-end" gap={10}>
          <button className="btn-ghost" onClick={closeDelete}>
            Cancel
          </button>
          <button
            style={{
              padding: "9px 18px",
              background: "var(--error)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontSize: "13.5px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Nunito Sans', sans-serif",
            }}
            onClick={handleDelete}
          >
            Delete Paper
          </button>
        </Group>
      </Modal>
    </div>
  );
}
