import { useState, useRef, useEffect } from "react";
import {
  Grid,
  Text,
  Group,
  Modal,
  Select,
  Stack,
  Divider,
  Textarea,
  Timeline,
  Stepper,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { gsap } from "gsap";
import {
  RiSendPlaneLine,
  RiAddLine,
  RiFileTextLine,
  RiCheckLine,
  RiTimeLine,
  RiRefreshLine,
  RiCloseLine,
  RiBookOpenLine,
  RiCalendarLine,
  RiMessageLine,
} from "react-icons/ri";
import { mockSubmissions, mockPapers, mockJournals } from "../data/mockData";
import { notifications } from "@mantine/notifications";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  accepted: {
    label: "Accepted",
    color: "#0a8a4c",
    bg: "var(--success-light)",
    icon: <RiCheckLine size={11} />,
  },
  under_review: {
    label: "Under Review",
    color: "#0369a1",
    bg: "var(--info-light)",
    icon: <RiTimeLine size={11} />,
  },
  revision: {
    label: "Revision Required",
    color: "#b45309",
    bg: "var(--warning-light)",
    icon: <RiRefreshLine size={11} />,
  },
  published: {
    label: "Published",
    color: "#0a8a4c",
    bg: "var(--success-light)",
    icon: <RiCheckLine size={11} />,
  },
  rejected: {
    label: "Rejected",
    color: "#b42318",
    bg: "var(--error-light)",
    icon: <RiCloseLine size={11} />,
  },
};

const SUBMISSION_STEPS = [
  { label: "Paper Submitted", icon: <RiSendPlaneLine size={14} /> },
  { label: "Editorial Check", icon: <RiFileTextLine size={14} /> },
  { label: "Peer Review", icon: <RiMessageLine size={14} /> },
  { label: "Decision", icon: <RiCheckLine size={14} /> },
  { label: "Published", icon: <RiBookOpenLine size={14} /> },
];

function SubmissionCard({ submission, onClick }: any) {
  const config = STATUS_CONFIG[submission.status] || STATUS_CONFIG.under_review;
  const stepMap: Record<string, number> = {
    under_review: 2,
    revision: 2,
    accepted: 3,
    published: 4,
    rejected: 3,
  };
  const currentStep = stepMap[submission.status] || 1;

  return (
    <div
      className="section-card"
      style={{ cursor: "pointer", transition: "all 0.2s" }}
      onClick={onClick}
      onMouseEnter={(e) => {
        //e.currentTarget.style.boxShadow = "var(--shadow-lg)";
        e.currentTarget.style.borderColor = "var(--color-200)";
      }}
      onMouseLeave={(e) => {
        //e.currentTarget.style.boxShadow = "var(--shadow-card)";
        e.currentTarget.style.borderColor = "var(--neutral-150)";
      }}
    >
      {/* Status stripe */}
      <div
        style={{
          height: "3px",
          background: config.color,
          borderRadius: "12px 12px 0 0",
        }}
      />

      <div style={{ padding: "18px 20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "14px",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text
              size="14.5px"
              fw={800}
              style={{
                color: "var(--neutral-900)",
                letterSpacing: "-0.01em",
                marginBottom: "5px",
              }}
              lineClamp={2}
            >
              {submission.paperTitle}
            </Text>
            <Group gap={6}>
              <RiBookOpenLine size={13} color="var(--color-600)" />
              <Text
                size="12.5px"
                fw={700}
                style={{ color: "var(--color-700)" }}
              >
                {submission.journal}
              </Text>
            </Group>
          </div>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "11.5px",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "99px",
              background: config.bg,
              color: config.color,
              flexShrink: 0,
            }}
          >
            {config.icon}
            {config.label}
          </span>
        </div>

        {/* Progress Steps */}
        <Stepper
          active={currentStep}
          color={config.color}
          size="xs"
          radius="xl"
          iconSize={26}
          completedIcon={<RiCheckLine size={14} />}
          styles={{
            root: {
              margin: "16px 0",
            },

            separator: {
              transition: "all 0.4s ease",
            },

            step: {
              padding: 0,
              flexDirection: "column",
              gap: 4,
            },

            stepWrapper: {
              marginBottom: 4,
            },

            stepBody: {
              marginTop: 0,
              textAlign: "center",
            },

            stepLabel: {
              fontSize: "9.5px",
              fontWeight: 700,
              lineHeight: 1.2,
              color: "var(--neutral-700)",
            },

            stepDescription: {
              display: "none",
            },

            stepIcon: {
              borderWidth: 2,
              transition: "all 0.3s ease",
            },
          }}
        >
          {SUBMISSION_STEPS.map((step, i) => (
            <Stepper.Step
              key={i}
              icon={step.icon}
              label={
                i === 0 || i === SUBMISSION_STEPS.length - 1 ? step.label : ""
              }
            />
          ))}
        </Stepper>

        {/* Meta */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "12px",
            borderTop: "1px solid var(--neutral-100)",
            flexWrap: "wrap",
            gap: "6px",
          }}
        >
          <Group gap={10}>
            <Group gap={4}>
              <RiCalendarLine size={12} color="var(--neutral-400)" />
              <Text size="11.5px" fw={600} c="var(--neutral-400)">
                Submitted{" "}
                {new Date(submission.submittedDate).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric", year: "numeric" },
                )}
              </Text>
            </Group>
            <Group gap={4}>
              <RiRefreshLine size={12} color="var(--neutral-400)" />
              <Text size="11.5px" fw={600} c="var(--neutral-400)">
                Round {submission.reviewRound}
              </Text>
            </Group>
          </Group>
          {submission.reviewerComments > 0 && (
            <Group gap={4}>
              <RiMessageLine size={12} color="var(--neutral-500)" />
              <Text size="11.5px" fw={700} c="var(--neutral-500)">
                {submission.reviewerComments} comment
                {submission.reviewerComments !== 1 ? "s" : ""}
              </Text>
            </Group>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JournalSubmissionsPage() {
  const [submissions] = useState(mockSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [detailOpened, { open, close }] = useDisclosure(false);
  const [newSubOpened, { open: openNew, close: closeNew }] =
    useDisclosure(false);
  const [activeTab, setActiveTab] = useState("all");
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current)
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4 },
      );
  }, []);

  const filtered = submissions.filter((s) => {
    if (activeTab === "all") return true;
    if (activeTab === "active")
      return ["under_review", "revision"].includes(s.status);
    return s.status === activeTab;
  });

  const handleView = (sub: any) => {
    setSelectedSubmission(sub);
    open();
  };

  return (
    <div className="page-wrapper">
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
            <h1 className="page-title">Journal Submissions</h1>
            <p className="page-subtitle">
              Track your paper submissions to international journals
            </p>
          </div>
          <button className="btn-primary" onClick={openNew}>
            <RiAddLine size={14} /> New Submission
          </button>
        </div>
      </div>

      {/* Summary */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {[
          {
            label: "Total Submissions",
            value: submissions.length,
            color: "var(--neutral-700)",
          },
          {
            label: "Under Review",
            value: submissions.filter((s) => s.status === "under_review")
              .length,
            color: "var(--info)",
          },
          {
            label: "Accepted",
            value: submissions.filter((s) =>
              ["accepted", "published"].includes(s.status),
            ).length,
            color: "var(--success)",
          },
          {
            label: "Need Revision",
            value: submissions.filter((s) => s.status === "revision").length,
            color: "var(--warning)",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="stat-card"
            style={{ flex: "1", minWidth: "130px" }}
          >
            <div
              className="stat-card-value"
              style={{ fontSize: "24px", color: s.color }}
            >
              {s.value}
            </div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginBottom: "18px",
          flexWrap: "wrap",
        }}
      >
        {[
          { val: "all", label: "All" },
          { val: "active", label: "Active" },
          { val: "under_review", label: "Under Review" },
          { val: "revision", label: "Revision" },
          { val: "accepted", label: "Accepted" },
          { val: "published", label: "Published" },
        ].map((t) => (
          <button
            key={t.val}
            className={`filter-chip ${activeTab === t.val ? "active" : ""}`}
            onClick={() => setActiveTab(t.val)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Submissions Grid */}
      {filtered.length > 0 ? (
        <Grid gap="md">
          {filtered.map((sub, i) => (
            <Grid.Col key={sub.id} span={{ base: 12, lg: 6 }}>
              <div
                className="animate-fade-up"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <SubmissionCard
                  submission={sub}
                  onClick={() => handleView(sub)}
                />
              </div>
            </Grid.Col>
          ))}
        </Grid>
      ) : (
        <div className="section-card">
          <div className="empty-state">
            <div className="empty-state-icon">🚀</div>
            <div className="empty-state-title">No submissions yet</div>
            <div className="empty-state-desc">
              Submit your first paper to an international journal
            </div>
            <button className="btn-primary" onClick={openNew}>
              <RiAddLine size={14} /> New Submission
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        opened={detailOpened && !!selectedSubmission}
        onClose={close}
        title={selectedSubmission?.journal}
        size="lg"
        centered
      >
        {selectedSubmission && (
          <Stack gap="md">
            <div>
              <Text
                size="16px"
                fw={800}
                style={{
                  color: "var(--neutral-900)",
                  marginBottom: "4px",
                  letterSpacing: "-0.01em",
                }}
              >
                {selectedSubmission.paperTitle}
              </Text>
              <Text size="13px" c="var(--neutral-500)">
                Submitted {selectedSubmission.submittedDate}
              </Text>
            </div>
            <Divider />
            <div>
              <Text size="13px" fw={800} c="var(--neutral-700)" mb={8}>
                Editorial Decision
              </Text>
              {selectedSubmission.decision ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    background: STATUS_CONFIG[selectedSubmission.status]?.bg,
                    color: STATUS_CONFIG[selectedSubmission.status]?.color,
                    fontSize: "13.5px",
                    fontWeight: 800,
                  }}
                >
                  {selectedSubmission.decision}
                </span>
              ) : (
                <Text size="13px" c="var(--neutral-400)">
                  Awaiting decision...
                </Text>
              )}
            </div>
            <div>
              <Text size="13px" fw={800} c="var(--neutral-700)" mb={8}>
                Submission Timeline
              </Text>
              <Timeline active={3} bulletSize={24} lineWidth={2}>
                <Timeline.Item
                  title="Submitted"
                  bullet={<RiSendPlaneLine size={12} />}
                >
                  <Text size="12px" c="var(--neutral-400)">
                    {selectedSubmission.submittedDate}
                  </Text>
                </Timeline.Item>
                <Timeline.Item
                  title="Editorial Check Complete"
                  bullet={<RiCheckLine size={12} />}
                >
                  <Text size="12px" c="var(--neutral-400)">
                    Passed initial screening
                  </Text>
                </Timeline.Item>
                <Timeline.Item
                  title="Under Peer Review"
                  bullet={<RiTimeLine size={12} />}
                >
                  <Text size="12px" c="var(--neutral-400)">
                    Review Round {selectedSubmission.reviewRound}
                  </Text>
                </Timeline.Item>
                {selectedSubmission.decision && (
                  <Timeline.Item
                    title={`Decision: ${selectedSubmission.decision}`}
                    bullet={<RiFileTextLine size={12} />}
                  >
                    <Text size="12px" c="var(--neutral-400)">
                      {selectedSubmission.lastUpdate}
                    </Text>
                  </Timeline.Item>
                )}
              </Timeline>
            </div>
            <Group justify="flex-end" gap={10}>
              <button className="btn-ghost" onClick={close}>
                Close
              </button>
              {selectedSubmission.status === "revision" && (
                <button className="btn-primary">
                  <RiSendPlaneLine size={14} /> Submit Revision
                </button>
              )}
            </Group>
          </Stack>
        )}
      </Modal>

      {/* New Submission Modal */}
      <Modal
        opened={newSubOpened}
        onClose={closeNew}
        title="New Journal Submission"
        size="md"
        centered
      >
        <Stack gap="sm">
          <Select
            label="Paper"
            placeholder="Select paper to submit..."
            data={mockPapers
              .filter((p) => p.status !== "submitted")
              .map((p) => ({ value: p.id, label: p.title }))}
            searchable
            styles={{ label: { fontWeight: 700 } }}
          />
          <Select
            label="Target Journal"
            placeholder="Select journal..."
            data={mockJournals.map((j) => ({
              value: j.id,
              label: `${j.name} (IF: ${j.impactFactor})`,
            }))}
            searchable
            styles={{ label: { fontWeight: 700 } }}
          />
          <Textarea
            label="Cover Letter"
            placeholder="Write a brief cover letter to the editor..."
            minRows={4}
            styles={{ label: { fontWeight: 700 } }}
          />
          <Divider my={4} />
          <Group justify="flex-end" gap={10}>
            <button className="btn-ghost" onClick={closeNew}>
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                closeNew();
                notifications.show({
                  title: "Paper Submitted!",
                  message: "Your paper has been submitted to the journal.",
                  color: "green",
                });
              }}
            >
              <RiSendPlaneLine size={14} /> Submit Paper
            </button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}
